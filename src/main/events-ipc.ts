import { ipcMain } from 'electron'

export function setupIpcHandlers(mainWindow: Electron.BrowserWindow | null) {
  ipcMain.handle('get-window-position', () => {
    return mainWindow ? mainWindow.getBounds() : [0, 0]
  })

  ipcMain.on('move-window', (_event, x, y) => {
    if (mainWindow) {
      mainWindow.setBounds({
        x,
        y,
        width: mainWindow.getBounds().width,
        height: mainWindow.getBounds().height
      })
    }
  })

  ipcMain.on('window-minimize', () => {
    console.log('minimize')

    if (mainWindow) mainWindow.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close()
  })
}
