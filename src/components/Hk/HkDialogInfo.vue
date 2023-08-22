<template>
  <div
    ref="wrap"
    v-loading="loading"
    :class="['wrap', { no: !hkPlayer }]"
    @mouseenter="iconShow = true"
    @mouseleave="iconShow = false"
  >
    <div
      :id="szId"
      class="hkinfo"
    />
    <el-icon
      v-if="showClose"
      title="挂断"
      class="close"
      color="rgba(255,255,255, .6)"
      :size="20"
      @click="handleClose"
    >
      <CircleClose />
    </el-icon>
    <div
      v-if="errorText"
      class="error"
    >
      加载异常
    </div>
    <div
      v-else
      class="playicon"
    >
      <el-icon
        v-show="iconShow"
        :size="50"
        color="#ddd"
        @click="playChange(played)"
      >
        <VideoPause v-if="played" />
        <VideoPlay v-else />
      </el-icon>
    </div>
    <div class="action">
      <div>
        <IconSvg
          :name="isMute ? 'icon-shengyinjingyin' : 'icon-shengyin'"
          color="#fcf498"
          class="icon iconall"
          @click="handleVoice()"
        />
      </div>
      <div
        v-if="isBack"
      >
        <el-icon
          :size="20"
          title="慢放"
          color="#fcf498"
          @click="handleRate(false)"
        >
          <DArrowLeft />
        </el-icon>
        <el-icon
          :size="20"
          color="#fcf498"
          title="快放"
          @click="handleRate(true)"
        >
          <DArrowRight />
        </el-icon>
      </div>
      <div class="last">
        <IconSvg
          :name="isFull ? 'icon-quxiaoquanping_o' : 'icon-quanping_o'"
          color="#fcf498"
          class="icon iconall"
          @click="handleAll"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, shallowRef, onMounted, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import HkPlayer from '@/utils/lib/hkPlayer'
import { ElIcon, ElLoading } from "element-plus"
import { DArrowRight, CircleClose, VideoPause, VideoPlay, DArrowLeft } from '@element-plus/icons-vue'
import 'element-plus/es/components/icon/style/css'

const props = defineProps({
  index: {
    type: Number,
    default: 1
  },
  isBack: {
    type: Boolean,
    default: false
  },
  immediate: {
    type: Boolean,
    default: true
  },
  data: {
    type: Object,
    default: () => ({})
  },
  hkoptions: {
    type: Object,
    default: () => ({})
  },
  resize: {
    type: Number,
    default: () => 0
  },
  getUrl: {
    type: Function,
    default: null
  },
  showClose: {
    type: Boolean,
    default: true
  }
})

const wrap = ref()
const hkPlayer = shallowRef()
const szId = ref(`hk_player_${props.index}`)
const iconShow = ref(false)
const played = ref(false)
const isMute = ref(true)
const errorText = ref()
const isFull = ref(false)
const loading = ref(false)

const emits = defineEmits(['pause', 'play', 'close'])

watch(() => props.resize, () => {
  hkPlayer.value.resize()
})

const wsUrl = ref()

const handleClose = () => {
  hkPlayer.value?.stopPlay()
  emits('close', props.data)
}

const playChange = (value) => {
  played.value = !value
  if (value) {
    emits('pause')
    hkPlayer.value.stopPlay(0).then((type) => {
      played.value = false
    })
  } else {
    emits('play')
    loading.value = true
    hkPlayer.value.realplay(props.data?.url || wsUrl.value).then(() => {
      console.log('played')
      played.value = true
      loading.value = false
    })
  }
}

const handleVoice = () => {
  if (!isMute.value) {
    hkPlayer.value.closeSound()
  } else {
    hkPlayer.value.openSound()
  }
  isMute.value = !isMute.value
}

const handleAll = () => {
  if (isFull.value) {
    document.exitFullscreen()
  } else {
    hkPlayer.value.singleFullScreenSingle()
  }
  isFull.value = !isFull.value
}

const handleRate = (type) => {
  if (type) {
    hkPlayer.value.playbackFast()
  } else {
    hkPlayer.value.playbackSlow()
  }
}

const init = (url) => {
  hkPlayer.value = new HkPlayer({
    oStyle: {
      borderSelect: '#000'
    },
    iCurrentSplit: 1,
    szId: szId.value,
    ...props.hkoptions
  })
  hkPlayer.value.resize()
  hkPlayer.value.addlisten('pluginErrorHandler', (iWndIndex, iErrorCode, oError) => {
    console.log('pluginErrorHandler', iWndIndex, iErrorCode, oError)
    errorText.value = iErrorCode
    loading.value = false
  })
  hkPlayer.value.addlisten('firstFrameDisplay', (iWndIndex, iErrorCode, oError) => {
    console.log('firstFrameDisplay', iWndIndex, iErrorCode, oError)
    errorText.value = ''
  })
  hkPlayer.value.addlisten('windowFullCcreenChange', (bFull) => {
    isFull.value = bFull
  })
  if (props.data?.url || wsUrl.value) {
    hkPlayer.value.realplay(props.data?.url || wsUrl.value).then(() => {
      played.value = true
      loading.value = false
    })
  } else {
    return ElMessage.error('预览地址无效！')
  }
  props.data.instance = hkPlayer.value
}

const resize = () => {
  hkPlayer.value.resize()
}

onMounted(async () => {
  loading.value = true
  if (props.immediate) {
    if (props.getUrl) {
      let res = await props.getUrl()
      if (res?.Statu === 1) {
        let url1 = res.Data?.data?.url.split('openUrl')[1]
        let url = `ws://221.204.213.61:559/openUrl${url1}`
        wsUrl.value = url
        init()
      } else {
        loading.value = false
      }
    } else {
      init()
    }
  }
})

onBeforeUnmount(() => {
  hkPlayer.value?.stopPlay()
})

defineExpose({ resize })
</script>
<style scoped lang='less'>
.wrap{
  position: relative;
  width: 100;
  height: 100%;
  &.no{
    & > *:not(.hkinfo){
      display: none;
    }
  }
  .hkinfo{
    width: 100%;
    height: 100%;
  }
  .close{
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    &:hover{
      color: rgb(252, 244, 152);
    }
  }
  .playicon {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
    z-index: 1;
  }
  .error{
    color: #f56c6c;
    height: 20px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .action{
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1;
    padding: 0 10px;
    img, svg{
      cursor: pointer;
    }
    & > div{
      &:not(:last-child){
        margin-right: 4px;
      }
      &.last{
        margin-left: auto;
      }
    }
    .icon{
      width: 24px;
      height: 24px;
    }
    .rate{
      width: 30px;
      text-align: center;
      background: rgba(0,0,0,.38);
      color: rgb(252, 244, 152);
    }
  }
}
</style>
