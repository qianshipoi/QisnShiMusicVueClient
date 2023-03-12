import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  nativeTheme,
  Tray,
  Menu,
  Event
} from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
let tray: Tray | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1280,
    height: 820,
    minWidth: 1000,
    minHeight: 640,
    frame: false,
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
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
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  win.webContents.send('theme-changed', nativeTheme.themeSource);

  win.on('close', (event: Event) => {
    // 截获 close 默认行为
    event.preventDefault();
    // 点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
    win.hide();
    win.setSkipTaskbar(true);
  });

  // 触发显示时触发
  win.on('show', () => {});
  // 触发隐藏时触发
  win.on('hide', () => {});

  tray = new Tray(join(process.env.PUBLIC, 'akua.jpg'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        win.show();
      }
    },
    {
      label: '退出',
      click: () => {
        win.destroy();
      }
    }
  ]);

  tray.setToolTip('QianShi music.');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    // 双击通知区图标实现应用的显示或隐藏
    win.isVisible() ? win.hide() : win.show();
    win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

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

ipcMain.on('window-close', () => {
  app.quit();
});

ipcMain.on('window-minimize', () => {
  win.minimize();
});

ipcMain.on('window-maximize', () => {
  win.setFullScreen(true);
});

ipcMain.on('window-unmaximize', () => {
  win.setFullScreen(false);
});

ipcMain.on('contrl-window', (event, args) => {
  switch (args) {
    case 'minimize':
      win.minimize();
      break;
    case 'restore':
      if (process.platform === 'darwin') {
        if (win.isFullScreen()) {
          win.setFullScreen(false);
        }
      }
      win.unmaximize();
      break;
    case 'maximize':
      if (process.platform === 'darwin') {
        win.setFullScreen(true);
      } else {
        win.maximize();
      }
      break;
    case 'close':
      win && win.close();
      break;
    case 'openDev':
      win.webContents.openDevTools();
      break;
    case 'backHome':
      if (process.platform === 'darwin') {
        win.setFullScreen(false);
      }
      win.setSize(1048, 700);
      win.setResizable(false);
      win.center();
      break;
    default:
      break;
  }
  event.returnValue = 'setSuccess';
});
