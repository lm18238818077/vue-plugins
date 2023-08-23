import { createApp, h } from 'vue'
import App from './App.vue'
import IconSvg from '@/components/IconSvg/index.vue'
import directive from '@/directive'

const app = createApp(App)
directive(app)
app.component('IconSvg', IconSvg).mount('#app')
app.config.globalProperties.$hk = h(App)

