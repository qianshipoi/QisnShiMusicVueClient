import { BrowserWindow, ipcMain, Menu, Tray, nativeTheme, shell, app } from 'electron'
import path from 'path'
interface IWindowsCfg {
  id: number | null;
  title: string;
  width: number | null;
  height: number | null;
  minWidth: number | null;
  minHeight: number | null;
  route: string;
  resizable: boolean;
  maximize: boolean;
  backgroundColor: string;
  data: object | null;
  isMultiWindow: boolean;
  isMainWin: boolean;
  parentId: number | null;
  modal: boolean;
}
interface IWindowsOpt {
  width: number;
  height: number;
  backgroundColor: string;
  autoHideMenuBar: boolean;
  resizable: boolean;
  minimizable: boolean;
  maximizable: boolean;
  frame: boolean;
  show: boolean;
  parent?: BrowserWindow;
  minWidth: number;
  minHeight: number;
  modal: boolean;
  icon: string;
  webPreferences: {
    contextIsolation: boolean; //上下文隔离
    nodeIntegration: boolean; //启用 Node 集成（是否完整的支持 node）
    // webSecurity: boolean;
    preload: string;
  };
}

export const windowsCfg: IWindowsCfg = {
  id: null, //唯一 id
  title: "", //窗口标题
  width: null, //宽度
  height: null, //高度
  minWidth: null, //最小宽度
  minHeight: null, //最小高度
  route: "", // 页面路由 URL '/manage?id=123'
  resizable: true, //是否支持调整窗口大小
  maximize: false, //是否最大化
  backgroundColor: "#eee", //窗口背景色
  data: null, //数据
  isMultiWindow: false, //是否支持多开窗口 (如果为 false，当窗体存在，再次创建不会新建一个窗体 只 focus 显示即可，，如果为 true，即使窗体存在，也可以新建一个)
  isMainWin: false, //是否主窗口(当为 true 时会替代当前主窗口)
  parentId: null, //父窗口 id  创建父子窗口 -- 子窗口永远显示在父窗口顶部 【父窗口可以操作】
  modal: false, //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
}
// 窗口组
interface IGroup {
  [props: string]: {
    route: string;
    isMultiWindow: boolean;
  };
}

export class Window {
  main: BrowserWindow | null | undefined
  group: IGroup
  tray: Tray | null | undefined

  constructor() {
    this.main = null; //当前页
    this.group = {}; //窗口组
    this.tray = null; //托盘
  }

  //窗口配置
  winOpts(wh: Array<number> = []): IWindowsOpt {
    return {
      width: wh[0],
      height: wh[1],
      backgroundColor: "#f7f8fc",
      autoHideMenuBar: true,
      resizable: true,
      minimizable: true,
      maximizable: true,
      frame: false,
      show: false,
      minWidth: 0,
      minHeight: 0,
      modal: true,
      icon: path.join(process.env.PUBLIC, 'favicon.ico'),
      webPreferences: {
        contextIsolation: false, //上下文隔离
        nodeIntegration: true, //启用 Node 集成（是否完整的支持 node）
        // webSecurity: true,
        preload: path.join(__dirname, "../preload/index.js"),
      },
    }
  }

  // 获取窗口
  getWindow(id: number): BrowserWindow {
    return BrowserWindow.fromId(id);
  }

  // 创建窗口
  createWindows(options: object) {
    const url = process.env.VITE_DEV_SERVER_URL;
    const indexHtml = path.join(process.env.DIST, 'index.html');
    let args = Object.assign({}, windowsCfg, options);
    // 判断窗口是否存在
    for (let i in this.group) {
      if (
        this.getWindow(Number(i)) &&
        this.group[i].route === args.route &&
        !this.group[i].isMultiWindow
      ) {
        this.getWindow(Number(i)).show()
        return;
      }
    }
    // 创建 electron 窗口的配置参数
    let opt = this.winOpts([args.width || 390, args.height || 590]);
    // 判断是否有父窗口
    if (args.parentId) {
      console.log("parentId：" + args.parentId);
      opt.parent = this.getWindow(args.parentId) as BrowserWindow; // 获取主窗口
    } else if (this.main) {
      console.log('main window');
    } // 还可以继续做其它判断

    // 根据传入配置项，修改窗口的相关参数
    opt.modal = args.modal;
    opt.resizable = args.resizable; // 窗口是否可缩放
    if (args.backgroundColor) opt.backgroundColor = args.backgroundColor; // 窗口背景色
    if (args.minWidth) opt.minWidth = args.minWidth;
    if (args.minHeight) opt.minHeight = args.minHeight;
    let win = new BrowserWindow(opt);
    console.log("window id:" + win.id);
    this.group[win.id] = {
      route: args.route,
      isMultiWindow: args.isMultiWindow,
    };
    // 是否最大化
    if (args.maximize && args.resizable) {
      win.maximize();
    }

    if (args.isMainWin) {
      if (this.main) {
        delete this.group[this.main.id];
        this.main.close();
      }
      this.main = win;
      this.main.on('close', (event: Event) => {
        // 截获 close 默认行为
        event.preventDefault();
        // 点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
        this.main.hide();
        this.main.setSkipTaskbar(true);
      });
      if (process.env.VITE_DEV_SERVER_URL) {
        win.webContents.openDevTools();
      }

      // Test actively push message to the Electron-Renderer
      win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString());
      });

      // Make all links open with the browser, not with the application
      win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url);
        return { action: 'deny' };
      });
    }

    win.on('close', () => { })
    args.id = win.id;
    if (process.env.VITE_DEV_SERVER_URL) {
      // electron-vite-vue#298
      win.loadURL(url + `${args.route}?winId=${args.id}`);
    } else {
      win.loadFile(indexHtml + `${args.route}?winId=${args.id}`);
    }

    win.once("ready-to-show", () => {
      win.show();
    });
  }
  // 创建托盘
  createTray() {
    this.tray = new Tray(path.join(process.env.PUBLIC, 'akua.jpg'));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示',
        click: () => {
          this.main.show();
        }
      },
      {
        type: "separator", // 分割线
      },
      {
        label: '退出',
        click: () => {
          for (let i in this.group) {
            this.getWindow(Number(i))?.destroy()
          }
          app.quit();
        }
      }
    ]);

    this.tray.setToolTip('QianShi music.');
    this.tray.setContextMenu(contextMenu);
    this.tray.on('double-click', () => {
      this.main.isVisible() ? this.main.hide() : this.main.show();
      this.main.isVisible() ? this.main.setSkipTaskbar(false) : this.main.setSkipTaskbar(true);
    });

    // 点击托盘显示窗口
    this.tray.on("click", () => {
      for (let i in this.group) {
        if (this.group[i]) this.getWindow(Number(i)).show();
      }
    });

    // 处理右键
    this.tray.on("right-click", () => {
      this.tray?.popUpContextMenu(contextMenu);
    });
  }

  _createTrayWindow() {
    const url = process.env.VITE_DEV_SERVER_URL;
    const indexHtml = path.join(process.env.DIST, 'index.html');
    const route = '/tray';
    const win = new BrowserWindow({
      width: 300,
      height: 300,
      show: false,
      frame: false,
      fullscreenable: false,
      resizable: false,
      transparent: true,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        preload: path.join(__dirname, "../preload/index.js"),
      },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(url + `${route}`);
    } else {
      win.loadFile(indexHtml + `${route}`);
    }
  }

  // 开启监听
  listen() {
    // 固定
    ipcMain.on('pinUp', (event: Event, winId) => {
      event.preventDefault();
      if (winId && (this.main as BrowserWindow).id == winId) {
        let win: BrowserWindow = this.getWindow(Number((this.main as BrowserWindow).id));
        if (win.isAlwaysOnTop()) {
          win.setAlwaysOnTop(false); // 取消置顶
        } else {
          win.setAlwaysOnTop(true); // 置顶
        }
      }
    })
    // 隐藏
    ipcMain.on("window-hide", (event, winId) => {
      console.log('window-hide:' + winId);

      if (winId) {
        this.getWindow(Number(winId)).hide();
      } else {
        for (let i in this.group) {
          if (this.group[i]) this.getWindow(Number(i)).hide();
        }
      }
    });
    // 显示
    ipcMain.on("window-show", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).show();
      } else {
        for (let i in this.group) {
          if (this.group[i]) this.getWindow(Number(i)).show();
        }
      }
    });
    // 最小化
    ipcMain.on("mini", (event: Event, winId) => {
      console.log("mini window id", winId);
      if (winId) {
        this.getWindow(Number(winId)).minimize();
      } else {
        for (let i in this.group) {
          if (this.group[i]) {
            this.getWindow(Number(i)).minimize();
          }
        }
      }
    });
    // 最大化
    ipcMain.on("window-max", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).maximize();
      } else {
        for (let i in this.group)
          if (this.group[i]) this.getWindow(Number(i)).maximize();
      }
    });
    // 创建窗口
    ipcMain.on("window-new", (event: Event, args) => this.createWindows(args));

    nativeTheme.on('updated', (e) => {
      const wins = BrowserWindow.getAllWindows();
      for (let win of wins) {
        win.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors);
      }
    });

    // 获取APP当前主题模式
    ipcMain.handle('dark-mode', () => {
      return nativeTheme.themeSource;
    });

    ipcMain.handle('should-use-dark-colors', () => {
      return nativeTheme.shouldUseDarkColors;
    });

    // 设置APP主题模式
    ipcMain.handle('dark-mode:change', (_, type: 'system' | 'light' | 'dark') => {
      nativeTheme.themeSource = type;
      return nativeTheme.themeSource;
    });

    ipcMain.on('window-close', (e: Event, winId) => {
      if (winId) {
        const window = this.getWindow(Number(winId))
        window?.close();
        window?.destroy();
        delete this.group[winId];
      } else {
        for (let i in this.group) {
          this.getWindow(Number(i))?.destroy()
        }
        app.quit();
      }
    });

    ipcMain.on('window-minimize', () => {
      this.main.minimize();
    });

    ipcMain.on('window-maximize', () => {
      this.main.setFullScreen(true);
    });

    ipcMain.on('window-unmaximize', () => {
      this.main.setFullScreen(false);
    });

    ipcMain.on('contrl-window', (event, args) => {
      switch (args) {
        case 'minimize':
          this.main.minimize();
          break;
        case 'restore':
          if (process.platform === 'darwin') {
            if (this.main.isFullScreen()) {
              this.main.setFullScreen(false);
            }
          }
          this.main.unmaximize();
          break;
        case 'maximize':
          if (process.platform === 'darwin') {
            this.main.setFullScreen(true);
          } else {
            this.main.maximize();
          }
          break;
        case 'close':
          this.main && this.main.close();
          break;
        case 'openDev':
          this.main.webContents.openDevTools();
          break;
        case 'backHome':
          if (process.platform === 'darwin') {
            this.main.setFullScreen(false);
          }
          this.main.setSize(1048, 700);
          this.main.setResizable(false);
          this.main.center();
          break;
        default:
          break;
      }
      event.returnValue = 'setSuccess';
    });
  }
}
