<template>
  <el-config-provider :z-index="5000">
    <Hk ref="hkRef"/>
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
  hkRef.value?.handleGetHkUrl({
    data: { deviceCode: 'e4071db6c3424bacba98242f844ea56e', name: 'cjj' },
    baseUrl: 'http://192.168.2.231:9000/api/sys/HikService/previewURLs',
  })
}


</script>
