<template>
  <div id="mse" />
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import Player, { Events } from 'xgplayer'
import FlvPlugin from 'xgplayer-flv'
import Mp4Plugin from 'xgplayer-mp4'
import FlvJsPlugin from 'xgplayer-flv.js'
import 'xgplayer/dist/index.min.css'

const playerRef = ref()
const props = defineProps({
  url: {
    type: String,
    default: () => ''
  }
})

const emits = defineEmits(['ended', 'pause', 'play'])
onMounted(() => {
  init(props.url)
})

const isFlvUrl = (url) => {
  return /.*(.flv)$/.test(url)
}

const init = (url) => {
  if (!playerRef.value) {
    playerRef.value?.destroy()
    playerRef.value = null
    playerRef.value = new Player({
      id: 'mse',
      lang: 'zh-cn',
      isLive: false,
      autoplay: true,
      fluid: true,
      plugins: isFlvUrl(url) ? [Mp4Plugin, FlvPlugin, FlvJsPlugin] : [],
      ...props,
      url
    })
    playerRef.value.on(Events.PLAY, () => {
      emits('play')
    })
    playerRef.value.on(Events.ENDED, () => {
      emits('ended')
    })
    playerRef.value.on(Events.PAUSE, () => {
      emits('pause')
    })
  }
}

const switchUrl = (url) => {
  let plugin = isFlvUrl(url) ? [Mp4Plugin, FlvPlugin, FlvJsPlugin] : []
  playerRef.value?.playNext({ url, plugin })
}

defineExpose({ playerRef, switchUrl })
</script>
<style scoped lang='less'>
#mse{
  // width: 600px;
}
</style>
