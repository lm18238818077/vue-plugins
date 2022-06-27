<template>
  <button @click="hiddenKey">隐藏</button>
  <button @click="showKey">展示</button>

  {{ showValue }}
  <Dq />
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue'
import Dq from './components/Toast/index.vue'
import store from "@/store/index";


const appCtx = getCurrentInstance()?.appContext;
console.log(appCtx)

const $dq = appCtx?.config.globalProperties.$dq;

const showValue = ref('');



</script>

<script>
export default {
  store,
  name: 'App',
}
</script>