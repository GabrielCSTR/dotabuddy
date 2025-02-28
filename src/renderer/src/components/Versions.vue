<script setup lang="ts">
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })
</script>

<template>
  <ul class="versions text-white">
    <li class="electron-version squada-one-regular">Electron v{{ versions.electron }}</li>
    <li class="chrome-version squada-one-regular">Chromium v{{ versions.chrome }}</li>
    <li class="node-version squada-one-regular">Node v{{ versions.node }}</li>
    <li class="node-version squada-one-regular">
      @Developed
      <a href="#" class="text-blue-400">xSTRDOTO</a>
    </li>
  </ul>
</template>
