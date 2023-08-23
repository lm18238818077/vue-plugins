<template>
  <Hk ref="hkRef"/>
  <el-button type="primary" @click="handle">aa</el-button>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue'
import Hk from './components/Hk/index.vue'
import { ElButton } from "element-plus";
import 'element-plus/es/components/button/style/css'

const hkRef = ref()

const appCtx = getCurrentInstance()?.appContext;
console.log(appCtx)

const $dq = appCtx?.config.globalProperties.$dq;

const handle = () => {
  hkRef.value?.handleGetHkUrl({
    data: { deviceCode: '7bb1519c69de4ac1883bfa0cc4ccae89', name: 'cjj' },
    baseUrl: 'http://192.168.2.231:9000/api/sys/HikService/previewURLs',
  })
}


</script>
