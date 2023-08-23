import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import Hk from './components/Hk/index.vue'


const CustomElement = wrap(Vue, Hk)

window.customElements.define('my-element', CustomElement)