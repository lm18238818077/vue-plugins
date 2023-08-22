<template>
  <DqDialog
    v-for="v, i in hkCallConnect"
    :key="v.deviceCode"
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
      @close="handleClose(v)"
    />
  </DqDialog>
</template>

<script setup>
import DqDialog from '@/components/Dq/DqDialog.vue'
import HkDialogInfo from './HkDialogInfo.vue'
import { useIcpStore } from '@/store/icp'
import dqVoicePng from '@/assets/dq_voice.png'
import dqVideoPng from '@/assets/dq_video.png'
import { storeToRefs } from 'pinia'
import { hkpreviewURLs } from '@/api/hk'

import { ElMessage, ElIcon } from "element-plus";
import { CircleClose } from '@element-plus/icons-vue'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/icon/style/css'


const icpStore = useIcpStore()
const { hkCallConnect } = storeToRefs(icpStore)

const handleClose = (v) => {
  icpStore.reduceCall(v)
}

const handleDialogClose = (v) => {
  v.instance?.stopAllPlay()
  handleClose(v)
}

const getHkUrl = async ({data, token, baseUrl}) => {
  return hkpreviewURLs({
    data: {
      cameraIndexCode: data.deviceCode,
      streamType: 0,
      protocol: 'ws',
      transmode: 1,
      expand: 'streamform=ps'
    },
    token,
    baseUrl
  })
}

const handleGetHkUrl = async ({ data, baseUrl, token }) => {
  let { deviceCode, host = '221.204.213.61:559', name, origin } = data
  let res = await getHkUrl({ data, token, baseUrl })
  let url1 = res.Data?.data?.url.split('openUrl')[1]
  let url = ''
  if (origin) {
    url = res.Data?.data?.url
  } else {
    url = `ws://${host}/openUrl${url1}`
  }
  if (url) {
    icpStore.addCall({ url, cid: deviceCode, name: name, type: 'hk', calltype: 'hkvideo', deviceCode })
  } else {
    ElMessage.error('未能获取到url链接！')
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
