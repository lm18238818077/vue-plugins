import { createApp } from 'vue'
import App from './App.vue'
import Dq from './components/Toast/index.js'
import store from "@/store/index";


createApp(App).use(store).mount('#app')
