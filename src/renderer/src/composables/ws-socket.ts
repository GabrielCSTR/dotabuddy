type WebSocketType = WebSocket | null

const WebSocketService = {
  socket: null as WebSocketType,

  connect() {
    this.socket = new WebSocket('ws://localhost:2305')

    this.socket.onopen = () => {
      console.log('WebSocket connection opened')
    }

    this.socket.onclose = () => {
      console.log('WebSocket connection closed')
    }
  }
}

export default WebSocketService
