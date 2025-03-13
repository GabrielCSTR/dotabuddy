import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    envPrefix: 'RENDERER_VITE_'
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    optimizeDeps: {
      include: ['xml2js', 'glob', 'fs-extra', 'graceful-fs'],
      esbuildOptions: {
        define: {
          global: 'globalThis'
        },
        plugins: [esbuildCommonjs(['redux-storage'])]
      }
    },
    plugins: [vue(), swcPlugin(), viteCommonjs()]
  }
})
