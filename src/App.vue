<template>
  <button @click="hiddenKey">隐藏</button>
  <button @click="showKey">展示</button>

  {{ showValue }}
</template>

<script>
import { defineComponent, getCurrentInstance, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const appCtx = getCurrentInstance()?.appContext;
    console.log(appCtx)

    const keyboard = appCtx?.config.globalProperties.$keyboard;

    const showValue = ref('');

    function showKey() {
      keyboard.show({
        // 调用show的时候传入业务需要监听的事件处理器
        onKeypress(i) {
          showValue.value = showValue.value += i;
        }
      });
    }

    function hiddenKey() {
      keyboard.hide();
    }

    return {
      hiddenKey,
      showKey,
      showValue
    }
  }
})
</script>