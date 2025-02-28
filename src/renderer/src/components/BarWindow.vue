<script setup lang="ts">
import { ref } from 'vue'

const isDragging = ref(false)
const offset = ref({ x: 0, y: 0 })

const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  const { screenX, screenY } = event

  window.electron.ipcRenderer.invoke('get-window-position').then((position) => {
    offset.value = {
      x: screenX - position[0],
      y: screenY - position[1]
    }
  })
}

const moveWindow = (event: MouseEvent) => {
  if (!isDragging.value) return

  const newX = event.screenX - offset.value.x
  const newY = event.screenY - offset.value.y

  window.electron.ipcRenderer.send('move-window', newX, newY)
}

const stopDrag = () => {
  isDragging.value = false
}

const minimize = () => {
  window.electron.ipcRenderer.send('window-minimize')
}

const maximize = () => {
  window.electron.ipcRenderer.send('window-maximize')
}

const close = () => {
  window.electron.ipcRenderer.send('window-close')
}

document.addEventListener('mousemove', moveWindow)
document.addEventListener('mouseup', stopDrag)
</script>

<template>
  <nav id="drag-area" class="flex w-screen bg-gray-900 z-10" @mousedown="startDrag">
    <div class="flex-1 flex items-center justify-center ml-32">
      <h1
        class="text-3xl bg-gradient-to-r squada-one-regular uppercase from-amber-800 via-amber-700 to-amber-600 inline-block text-transparent bg-clip-text drop-shadow-lg shadow-amber-700"
      >
        DotoBot | v1.0
      </h1>
    </div>
    <div class="flex items-center justify-center z-50">
      <p-button
        id="minimize"
        icon="pi pi-minus-circle"
        aria-label="minimize"
        size="small"
        class="text-green-500 hover:text-green-700"
        @click="minimize"
      ></p-button>
      <p-button
        id="maximize"
        icon="pi pi-chevron-circle-up"
        aria-label="maximize"
        size="small"
        class="text-yellow-500 hover:text-yellow-700"
        @click="maximize"
      ></p-button>
      <p-button
        id="close"
        icon="pi pi-times-circle"
        aria-label="closed"
        size="small"
        class="text-red-500 hover:text-red-700"
        @click="close"
      ></p-button>
    </div>
  </nav>
</template>

<style scoped>
#drag-area {
  -webkit-app-region: drag;
}

#drag-area button,
#drag-area p-button {
  -webkit-app-region: no-drag;
}
</style>
