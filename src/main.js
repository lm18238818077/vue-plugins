import { createApp } from 'vue'
import App from './App.vue'
import IconSvg from '@/components/IconSvg/index.vue'
import { createPinia } from 'pinia'
import directive from '@/directive'

const pinia = createPinia()
const app = createApp(App)
directive(app)
app.component('IconSvg', IconSvg).use(pinia).mount('#app')
