<template>
  <el-config-provider :z-index="5000">
    <div style="width: 332px;height: 230px">
      <HkDialogInfo
        :data="{rescode: '4d39ace61ac34ca1bbda4224625eb392', sercode: 'HuHe' }"
        :hkoptions="{iWidth: 332, iHeight: 230}"
        :countdown="10"
        host="http://221.204.213.61:20080"
      />
    </div>
  </el-config-provider>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue'
import Hk from './components/Hk/index.vue'
import HkDialogInfo from './components/Hk/HkDialogInfo.vue'
import { ElButton, ElConfigProvider } from "element-plus";
import 'element-plus/es/components/button/style/css'

const hkRef = ref()

const appCtx = getCurrentInstance()?.appContext;
console.log(appCtx)

const $dq = appCtx?.config.globalProperties.$dq;

const handle = () => {
  hkRef.value?.handleGetHkUrl({rescode: '626b84578eaa4472a9badfec669f5899', sercode: 'HuHe', endTime: '2023-11-06 11:00:00', beginTime: '2023-11-06 10:00:00' })
}


</script>
