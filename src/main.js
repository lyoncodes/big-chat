import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'
import FontAwesome from '@/plugins/FontAwesome'

firebase.initializeApp(firebaseConfig)

// on authStateChange
firebase.auth().onAuthStateChanged(user => {
  store.dispatch('unsubscribeAuthUserSnapshot')
  if (user) {
    store.dispatch('fetchAuthUser')
  }
})

const bigChat = createApp(App)
bigChat.use(router)
bigChat.use(store)
bigChat.use(FontAwesome)

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
