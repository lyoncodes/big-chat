import { createApp } from 'vue'
import App from './App.vue'

const noteApp = createApp(App)
noteApp.component('NiceButton', {})
noteApp.mount('#app')
