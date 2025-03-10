import { ipcMain } from 'electron'
import D2gsi from 'dota2-gsi'
import WebSocket from 'ws'
import dota2Events from './dota2-events.json' // dev mod

export function setupIpcGSIDota2Handlers() {
  const gsi = new D2gsi({ port: 3000 }) // Servidor na porta 3000

  let gameState = {}

  // WEBSOCKET SERVER
  const wss = new WebSocket.Server({ port: 2305 })

  wss.on('connection', (ws) => {
    console.log('Client connected')

    // SEND GAME STATE
    // gameState = dota2Events // dev mod
    ws.send(JSON.stringify(gameState))

    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })

  // GSI EVENTS
  gsi.events.on('newclient', (client) => {
    console.log('New client connection, IP address: ' + client.ip)
    if (client.auth && client.auth.token) {
      console.log('Auth token: ' + client.auth.token)
    } else {
      console.log('No Auth token')
    }
    client.on('newdata', function (data) {
      gameState = data
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(gameState))
        }
      })
    })
  })

  ipcMain.handle('get-dota2-data', () => {
    return gameState
  })
}
