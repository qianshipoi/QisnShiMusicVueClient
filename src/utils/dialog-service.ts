import { ipcRenderer } from 'electron'
interface DialogOptions {
  title: string;
  widht?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  closable?: boolean;
  parentId?: number;
}


export function openDialog(options: DialogOptions) {
  ipcRenderer.send("window-new", {
    title: options.title,
    route: "dialog",
    width: options.widht || 800,
    height: options.height || 600,
    minWidth: options.minWidth || 800,
    minHeight: options.minHeight || 600,
    resizable: options.resizable || true,
    maximizable: options.maximizable || true,
    minimizable: options.minimizable || true,
    closable: options.closable || true,
    parentId: options.parentId,
  });
}
