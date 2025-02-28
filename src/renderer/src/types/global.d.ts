import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcRenderer } from 'electron'

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
    electron: ElectronAPI
  }
}
