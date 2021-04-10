import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'

const noteApp = createApp(App)
noteApp.use(router)
noteApp.use(store)

// Register all components globally
const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  noteApp.component(baseComponentName, baseComponentConfig)
})

noteApp.mount('#app')
