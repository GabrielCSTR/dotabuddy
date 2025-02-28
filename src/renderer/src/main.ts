import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()

// Plugins call
const plugins = ['primevue'] as const

async function loadPlugins() {
  for (const plugin of plugins) {
    const { default: defaultImport } = await import(`./plugins/${plugin}.ts`)

    const fn = defaultImport || (() => Promise.resolve(undefined))

    await fn({ app, pinia, router })
  }
}

loadPlugins().finally(() => {
  // Default plugins use
  app.use(pinia)

  app.use(router)

  app.mount('#app')
})
