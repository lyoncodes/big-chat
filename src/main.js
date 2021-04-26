import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'

firebase.initializeApp(firebaseConfig)
const bigChat = createApp(App)
bigChat.use(router)
bigChat.use(store)

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
  bigChat.component(baseComponentName, baseComponentConfig)
})

bigChat.mount('#app')
