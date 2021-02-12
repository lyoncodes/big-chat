import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

const noteApp = createApp(App)
noteApp.use(router)
noteApp.mount('#app')
