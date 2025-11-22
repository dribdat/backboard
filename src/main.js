import { createApp } from 'vue'
import App from './App.vue'
import Markdown from 'vue3-markdown-it'
import Countdown from 'vue3-flip-countdown'

import router from './router'

const app = createApp(App)

app.use(router)
app.use(Markdown)
app.use(Countdown)

app.mount('#app')
