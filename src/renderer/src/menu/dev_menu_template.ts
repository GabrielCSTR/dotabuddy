import { BrowserWindow } from 'electron'

export const devMenuTemplate = {
  label: 'Development',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      selector: 'reload:',
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow) {
          focusedWindow.reload()
        }
      }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+CmdOrCtrl+I',
      selector: 'toggleDevTools:',
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow) {
          focusedWindow.webContents.toggleDevTools()
        }
      }
    }
  ]
}
