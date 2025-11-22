import { createApp } from 'vue'
import App from './App.vue'
import Markdown from 'vue3-markdown-it'
import router from './router'

const app = createApp(App)

app.component('vue-markdown', Markdown)

app.use(router)

app.mount('#app')
