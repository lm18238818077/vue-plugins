import { App, createApp, h, reactive } from 'vue';
import Keyboard from './index.vue';

/** 组件dom挂在后得到的组件实例 */
let $vm = null;

/** keyboard需要接收并跟踪变化的的props */
const props = reactive({
  show: false
})

/** 空函数 */
const loop = (...args) => {};

/** 默认配置 */
const globalConfig = {
  onKeypress: loop
}

/** 插件控制器 controller */
const $keyboard = {
  /** 调用show方法可以改变默认的配置 */
  show(config) {
    /** 响应式状态，改变该状态，相当于传给组件的props变化了 */
    props.show = true;
    /** 修改默认的keypress监听处理为show方法传入的 */
    globalConfig.onKeypress = config.onKeypress;
  },
  hide() {
    props.show = false;
  }
}

export default {
  install: (app, options) => {
    if (!$vm) {
      const wrapper = document.createElement('div');
      wrapper.id = 'keyboard';
      document.body.appendChild(wrapper)
  
      $vm = createApp({
        setup() {
          return () => { // setup 可以返回一个render函数
            // h函数接收3个参数，“组件或dom”、props、children
            return h(Keyboard, {
              // 其他属性，会被当做组件的props <Keyboard :show="props.show" />
              ...props,
              // onXxx 相当于 <Keyboard @Xxx="globalConfig.onKeypress" />
              onKeypress: globalConfig.onKeypress
            })
          }
        }
      }).mount(wrapper);
      /** 将插件controller注册到全局上 */
      app.config.globalProperties.$keyboard = $keyboard
    }
  }
}