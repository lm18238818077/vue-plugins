import { createApp, h, reactive, ref } from 'vue';
import IconSvg from '@/components/IconSvg/index.vue'
import { ElConfigProvider } from 'element-plus'
import loading from '@/directive/loading'

import Hk from './index.vue';

/** 组件dom挂在后得到的组件实例 */
let $vm = null;

/** keyboard需要接收并跟踪变化的的props */

const $ref = ref(null)

const props = reactive({
})


/** 插件控制器 controller */
const $hk = {
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
      wrapper.id = 'hk';
      document.body.appendChild(wrapper)
  
      $vm = createApp({
        setup() {
          return () => {
            return h(ElConfigProvider, { zIndex: 100000 }, [
              h(Hk, {
                ...props,
                ref: $ref
              })
            ])
          }
        }
      }).component('IconSvg', IconSvg).directive('loading', loading).mount(wrapper);
      /** 将插件controller注册到全局上 */
      app.config.globalProperties.$hk = $hk
    }
  }
}