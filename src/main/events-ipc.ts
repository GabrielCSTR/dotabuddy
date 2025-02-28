import { BrowserWindow, ipcMain } from 'electron'

export function setupIpcHandlers() {
  ipcMain.handle('get-window-position', () => {
    const win = BrowserWindow.getFocusedWindow()
    return win ? win.getBounds() : [0, 0]
  })

  ipcMain.on('move-window', (_event, x, y) => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.setBounds({ x, y, width: win.getBounds().width, height: win.getBounds().height })
    }
  })

  ipcMain.on('window-minimize', () => {
    console.log('minimize')

    const win = BrowserWindow.getFocusedWindow()
    if (win) win.minimize()
  })

  ipcMain.on('window-maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }
  })

  ipcMain.on('window-close', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.close()
  })
}
