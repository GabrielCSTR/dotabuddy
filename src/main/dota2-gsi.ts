import { ipcMain } from 'electron'
import D2gsi from 'dota2-gsi'
import dota2Events from './dota2-events.json'

export function setupIpcGSIDota2Handlers() {
  const gsi = new D2gsi({ port: 3000 }) // Servidor na porta 3000

  let gameState = {}

  gsi.events.on('newclient', (client) => {
    client.on('newdata', function (data) {
      gameState = data
    })
  })

  ipcMain.handle('get-dota2-data', () => {
    // return gameState
    return dota2Events
  })
}
