import { createApp } from 'vue'
import './style.css'
import router from './router/router'

import App from './App.vue'

createApp(App).mount('#app')

const app = createApp(App)

// 使用路由
app.use(router)

app.mount('#app')