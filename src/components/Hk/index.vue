<template>
  <DqDialog
    v-for="v, i in hkCallConnect"
    :key="i"
    :model-value="true"
    :destroy-on-close="true"
    :small="true"
    :width="350"
  >
    <template #header>
      <div class="header">
        <img :src="v.calltype === 'hktalk' ? dqVoicePng : dqVideoPng">
        <div>
          {{ v.name }}
        </div>
        <el-icon
          title="挂断"
          class="close"
          color="rgba(255,255,255, .6)"
          :size="20"
          @click="handleDialogClose(v)"
        >
          <CircleClose />
        </el-icon>
      </div>
    </template>
    <HkDialogInfo
      v-if="v.calltype === 'hkvideo'"
      :index="i"
      :data="v"
      :hkoptions="{iWidth: 332, iHeight: 230}"
      :countdown="props.countdown"
      :host="props.host"
      @close="handleClose(v)"
    />
  </DqDialog>
</template>

<script setup>
import { computed, watch } from 'vue'
import DqDialog from '@/components/Dq/DqDialog.vue'
import HkDialogInfo from './HkDialogInfo.vue'
import { useIcpStore } from '@/store/icp'
import dqVoicePng from '@/assets/dq_voice.png'
import dqVideoPng from '@/assets/dq_video.png'

import { ElMessage, ElIcon } from "element-plus";
import { CircleClose } from '@element-plus/icons-vue'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/icon/style/css'

const props = defineProps({
  countdown: {
    type: [Number, String],
    default: 10
  },
  host: {
    type: String,
    default: ''
  }
})

const icpStore = useIcpStore()
const hkCallConnect = computed(() => {
  return icpStore.hkCallConnect.value
})
const handleClose = (v) => {
  icpStore.reduceCall(v)
}

watch(() => [...hkCallConnect.value], (n) => {
  console.log(n)
})

const handleDialogClose = (v) => {
  v.instance?.stopAllPlay()
  handleClose(v)
}

const handleGetHkUrl = async ({ rescode, sercode, name = '视频监控' }) => {
  if (rescode && sercode) {
    icpStore.addCall({ cid: rescode, name: name, type: 'hk', calltype: 'hkvideo', rescode, sercode })
  } else {
    ElMessage.error('无设备编码！')
  }
}

defineExpose({
  handleGetHkUrl
})

</script>
<style scoped lang='less'>

.header{
  display: flex;
  align-items: center;
  color: #fff;
  .el-dialog__title{
    color: #fff;
    font-size: 16px;
  }
  & > i{
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
