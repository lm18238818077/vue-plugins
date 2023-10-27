<template>
  <el-config-provider :z-index="5000">
    <Hk ref="hkRef" host="http://192.168.2.102:2025"/>
    <el-button type="primary" @click="handle">aa</el-button>
  </el-config-provider>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue'
import Hk from './components/Hk/index.vue'
import { ElButton, ElConfigProvider } from "element-plus";
import 'element-plus/es/components/button/style/css'

const hkRef = ref()

const appCtx = getCurrentInstance()?.appContext;
console.log(appCtx)

const $dq = appCtx?.config.globalProperties.$dq;

const handle = () => {
  hkRef.value?.handleGetHkUrl({rescode: 'cf8261c864dd46309c0b197b217bce6f', sercode: 'ShiHeng'})
}


</script>
