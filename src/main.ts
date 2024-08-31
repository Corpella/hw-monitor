import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import 'vue-data-ui/style.css'

createApp(App).use(createPinia()).mount('#app')
