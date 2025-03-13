import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  versions: process.versions,
  ipcRenderer: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on: (channel: string, func: (...args: any[]) => void) =>
      ipcRenderer.on(channel, (_event, ...args) => func(...args)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
