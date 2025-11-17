import { createApp } from 'vue'
import { createPinia } from 'pinia'
import UiLib from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/main.css'
import './assets/global.scss'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(UiLib)
app.use(router)

app.mount('#app')