import { App, createApp, h, reactive, ref } from 'vue';
import Dq from './index.vue';

/** 组件dom挂在后得到的组件实例 */
let $vm = null;

/** keyboard需要接收并跟踪变化的的props */

const $ref = ref(null)

const props = reactive({
  user: '66647000',
  config: {}
})

/** 默认配置 */
const globalConfig = {
  
}

/** 插件控制器 controller */
const $dq = {
  /** 调用show方法可以改变默认的配置 */
  changeConfig(val){
    Object.assign(props.config, val)
  },
  $ref
}

export default {
  install: (app, options) => {
    if (!$vm) {
      const wrapper = document.createElement('div');
      wrapper.id = 'dq';
      document.body.appendChild(wrapper)
  
      $vm = createApp({
        setup() {
          return () => {
            return h(Dq, {
              ...props,
              ref: $ref
            })
          }
        }
      }).mount(wrapper);
      /** 将插件controller注册到全局上 */
      app.config.globalProperties.$dq = $dq
    }
  }
}