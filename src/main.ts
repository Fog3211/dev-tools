import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import router from './router'
import App from './App.vue'

// Import locales
import en from './locales/en.json'
import zh from './locales/zh.json'

// Import styles
import './styles/main.css'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

// Create app instance
const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)
app.use(i18n)

// Mount app
app.mount('#app') 