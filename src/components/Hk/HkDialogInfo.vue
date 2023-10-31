<template>
    <div
    id="hk_wrap"
    ref="wrap"
    v-loading="loading"
    :class="['wrap', { no: !hkPlayer }]"
    :style="countDownNow < 0 ? {background: `url(${lastFrame}) center / 100% 100% no-repeat`} : {background: '#000'}"
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
      v-if="recordVideo"
      class="recordVideo"
    >
      正在录制 REC {{ recordTime }}
    </div>
    <div
      v-if="props.countdown && targetCountDown > 0 && !playback"
      class="countdown"
    >
      <div
        v-if="countDownNow < 0"
        class="end"
      >
        <span>已达到限时播放时长，播放结束</span>
        <el-button
          size="small"
          @click="handlePlayBack(true)"
        >
          继续播放
        </el-button>
      </div>
      <el-countdown
        v-show="countDownNow < 10000 && countDownNow > 0"
        :value="targetCountDown"
        format="ss"
        :value-style="{fontSize: '14px', fontWeight: 'bold', color: '#fff'}"
        @change="handleCountDown"
        @finish="handleFinish"
      >
        <template #suffix>
          <div class="continuePlay">
            <span>秒后停止播放</span>
            <span
              class="play"
              @click="handleContinuePlay()"
            >继续播放</span>
          </div>
        </template>
      </el-countdown>
    </div>
    <div
      v-if="errorText"
      class="error"
    >
      播放异常
      <el-icon
        title="重新加载"
        size="18"
        color="#fff"
        @click="handlePlayBack(playback)"
      >
        <Refresh />
      </el-icon>
    </div>
    <div
      v-if="streamEnd"
      class="streamEnd"
    >
      播放结束
      <el-button
        link
        @click="handlePlayBack(true)"
      >
        返回预览
      </el-button>
    </div>
    <div
      v-else
      class="playicon"
    >
      <el-icon
        v-if="playback && !errorText"
        v-show="iconShow"
        :size="50"
        color="#ddd"
        @click="playChange(played)"
      >
        <VideoPause v-if="played" />
        <VideoPlay v-else />
      </el-icon>
    </div>
    <div
      :class="['action', { playback: playback }]"
    >
      <div
        v-if="playing"
        :class="['voice', { noMute: !isMute }]"
        :title="isMute ? '开启声音' : '关闭声音'"
      >
        <IconSvg
          :name="isMute ? 'icon-shengyinjingyin' : 'icon-shengyin'"
          color="#fcf498"
          class="hkicon iconall"
          @click="handleVoice()"
        />
        <el-slider
          v-model="voiceValue"
          vertical
          height="60px"
          class="voiceSlider"
          size="small"
          @change="handleVoiceValue"
        />
      </div>
      <div v-if="playing">
        <el-icon
          color="#fcf498"
          :size="20"
          class="hkicon iconall"
          title="截屏"
          @click="handleCapture()"
        >
          <Camera />
        </el-icon>
      </div>
      <div v-if="playing">
        <el-icon
          :color="recordVideo ? '#f56c6c' : '#fcf498'"
          :size="20"
          class="hkicon iconall"
          :title="recordVideo ? '停止录像' : '开始录像'"
          @click="handleVideo()"
        >
          <VideoCamera />
        </el-icon>
      </div>
      <div v-if="!playback && playing">
        <el-icon
          :color="voiceing ? '#f56c6c' : '#fcf498'"
          :size="20"
          class="hkicon iconall"
          :title="voiceing ? '停止对讲' : '开始对讲'"
          @click="handleTalk()"
        >
          <component :is="voiceing ? Mute : Microphone" />
        </el-icon>
      </div>
      <div
        v-if="!playback && playing"
        :title="isZi ? '切换为主码流' : '切换为子码流'"
      >
        <IconSvg
          :name="isZi ? 'icon-xianlu2' : 'icon-xianlu1'"
          color="#fcf498"
          class="hkicon iconall"
          @click="handleMa()"
        />
      </div>
      <el-popover
        v-if="!playback && playing"
        placement="bottom"
        title="云台控制"
        :width="186"
        trigger="click"
        :teleported="false"
      >
        <template #reference>
          <div>
            <el-icon
              color="#fcf498"
              :size="20"
              class="hkicon iconall"
              title="云台控制"
            >
              <Coordinate />
            </el-icon>
          </div>
        </template>
        <div class="controll">
          <el-icon
            v-for="v in 4"
            :key="v"
            size="30"
            :title="controlToCh1[v]"
            @click="handleControl(v)"
          >
            <ArrowLeftBold />
          </el-icon>
          <el-icon
            v-for="v in 4"
            :key="v"
            size="25"
            :title="controlToCh2[v]"
            @click="handleControl(v + 4)"
          >
            <ArrowLeft />
          </el-icon>
          <el-icon
            size="24"
            title="焦距变大"
            @click="handleControl(9)"
          >
            <ZoomIn />
          </el-icon>
          <el-icon
            size="24"
            title="焦距变小"
            @click="handleControl(10)"
          >
            <ZoomOut />
          </el-icon>
        </div>
      </el-popover>
      <el-popover
        v-model:visible="playbackTimeVisible"
        placement="bottom"
        title="选择回放时间"
        :width="350"
        trigger="click"
        :teleported="false"
      >
        <template #reference>
          <div v-if="playback">
            <el-icon
              color="#fcf498"
              :size="20"
              class="hkicon iconall"
              title="选择回放时间"
            >
              <Calendar />
            </el-icon>
          </div>
        </template>
        <el-form
          ref="ruleFormRef"
          :model="formData"
          size="small"
        >
          <el-form-item
            prop="playbackTime"
            :rules="[
              {
                required: true,
                message: '请选择时间',
                trigger: 'blur',
              }
            ]"
          >
            <el-date-picker
              v-model="playbackTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              :teleported="false"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="handlePlayBackTime"
            />
          </el-form-item>
        </el-form>
      </el-popover>

      <div
        v-if="playback && playing"
      >
        <el-icon
          :size="20"
          title="慢放"
          color="#fcf498"
          class="hkicon iconall"
          @click="handleRate(false)"
        >
          <DArrowLeft />
        </el-icon>
        <el-icon
          :size="20"
          color="#fcf498"
          title="快放"
          class="hkicon iconall"
          @click="handleRate(true)"
        >
          <DArrowRight />
        </el-icon>
      </div>
      <div>
        <el-icon
          v-if="!errorText"
          color="#fcf498"
          :size="20"
          class="hkicon iconall"
          :title="playback ? '返回' : '打开录像回放'"
          @click="handlePlayBack(playback)"
        >
          <component :is="playback ? ArrowLeft : Film" />
        </el-icon>
      </div>
      <div class="last">
        <IconSvg
          v-if="playing"
          :name="isFull ? 'icon-quxiaoquanping_o' : 'icon-quanping_o'"
          color="#fcf498"
          class="hkicon iconall"
          @click="handleAll"
        />
      </div>
    </div>
    <VideoTimeline
      v-if="playback && !errorText && !streamEnd"
      id="timeSlider"
      ref="timeSliderRef"
      :init-time="playCurrentTime"
      :init-zoom-index="1"
      :enable-zoom="false"
      hover-text-color="#fff"
      :time-segments="playbackData.list || []"
      @time-change="timeChange"
      @click_time-segments="(_, time) => dragTimeChange(time)"
      @click_timeline="dragTimeChange"
      @drag-time-change="dragTimeChange"
      @mousedown="mousedownTimeLine"
    />
  </div>
</template>

<script setup>
import { reactive, ref, shallowRef, onMounted, onBeforeMount, onBeforeUnmount, watch, computed } from 'vue'
import HkPlayer from '@/utils/lib/hkPlayer'
import hkStatus from '@/config/hk/status'
import { version } from '@/config/hk'
import VideoTimeline from '@/components/VideoTimeline/index.vue'
import { hkControl, hkDeviceInfo } from '@/api/hk'
import { useTime } from '@/hooks/use-time-record'
import { ElMessage } from 'element-plus'
import { useEventListener } from '@/hooks/event/useEventListener'
import dayjs from 'dayjs'

import { ElIcon, ElPopover, ElButton, ElCountdown, ElSlider, ElDatePicker, ElFormItem, ElForm } from "element-plus"
import { DArrowRight, CircleClose, VideoPause, VideoPlay, DArrowLeft, Camera, VideoCamera, ArrowLeft, Refresh, Film, Mute, Microphone, ZoomOut, ZoomIn, ArrowDownBold, ArrowUpBold, ArrowRightBold, ArrowLeftBold, Coordinate, Calendar } from '@element-plus/icons-vue'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/popover/style/css'
import 'element-plus/es/components/date-picker/style/css'

const props = defineProps({
  index: {
    type: [Number, String],
    default: 1
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
  countdown: {
    type: Number,
    default: () => 0
  },
  getUrl: {
    type: Function,
    default: null
  },
  originHost: {
    type: Boolean, // 海康预览地址是否需要替换
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  host: {
    type: String,
    default: ''
  }
})

const ruleFormRef = ref()
const wrap = ref()
const hkPlayer = shallowRef()
const szId = ref(`hk_player_${props.index}`)
const iconShow = ref(false)
const played = ref(false) // 播放还是暂停
const isMute = ref(true)
const errorText = ref()
const isFull = ref(false)
const loading = ref(false)
const recordVideo = ref(false)
const voiceing = ref(false)
const playback = ref(false) // 是否是回放模式下
const playbackTimeVisible = ref(false)
const playbackIndex = ref(0)
const playbackData = ref({})
const streamEnd = ref(false) // 回放结束的标志
const voiceValue = ref(50)
const playing = ref(false) // 是否有正在播放的资源，暂停不算
const countDownNow = ref(0) // 播放倒计时 <0说明停止 >0说明正在倒计时中
const targetCountDown = ref(0) // 目标倒计时
const playOldTime = ref(0) // 记录拖动的时候播放的时间
const isZi = ref(true) // 子主码流切换
const lastFrame = ref() // 限流停止后最后一帧图片
const getUrlFlag = ref(false) // 取流接口开关；防止多次请求

const timeSliderRef = ref()
const playCurrentTime = ref()
let timer = null

const emits = defineEmits(['pause', 'play', 'close'])
const { recordTime, start, end } = useTime()
const playbackCurrent = computed(() => playbackData.value.list?.[playbackIndex.value])
const deviceCode = computed(() => props.data?.deviceCode)
const hkDeviceDetail = computed(() => {
  return { RESOURCE_CODE: props.data?.rescode, SERVER_CODE: props.data?.sercode }
}) // 海康设备的信息

const hkVersion = computed(() => version[hkDeviceDetail.value?.SERVER_CODE] || 'v1')

const playbackTime = ref([
  dayjs().format('YYYY-MM-DD 00:00:00'),
  dayjs().format('YYYY-MM-DD 23:59:59')
])
const formData = reactive({ playbackTime }) // 为了不改以前写的

const messageSetting = computed(() => ({ appendTo: wrap.value, customClass: 'hkmessage', offset: 1 }))

watch(() => props.resize, () => {
  resize()
})

useEventListener({
  el: window,
  name: 'mousemove',
  isDebounce: false,
  wait: 800,
  listener: () => {
    if (countDownNow.value > 0) {
      handleContinuePlay()
    }
    if (props.countdown && targetCountDown.value > 0 && !playback.value && countDownNow.value < 0) {
      // 限流暂停后；鼠标移动开始重新播放
      handlePlayBack(true)
    }
  }
})

const controlToCh1 = ref({
  1: '向左',
  2: '向下',
  3: '向右',
  4: '向上'
})

const controlToCh2 = ref({
  1: '左上',
  2: '左下',
  3: '右下',
  4: '右上'
})

const wsUrl = ref(props.data?.url)

const handleClose = () => {
  playbackEnd()
  emits('close', props.data)
}

const playChange = (value) => {
  played.value = !value
  if (value) {
    emits('pause')
    hkPlayer.value.playbackPause()
    playbackPause()
  } else {
    emits('play')
    hkPlayer.value.playbackResume()
    playbackPlay()
  }
}

const messageError = (message) => {
  ElMessage.error({ ...messageSetting.value, message })
}

const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const handleCapture = (download) => {
  let fileName = Date.now()
  if (download) {
    return new Promise((resolve, reject) => {
      hkPlayer.value.capture(fileName, 'JPEG', (img) => {
        lastFrame.value = img
        resolve(img)
      })
    })
  } else {
    hkPlayer.value.capture(fileName)
  }
}

const handleVideo = () => {
  if (recordVideo.value) {
    hkPlayer.value.recordStop().then(() => {
      recordVideo.value = false
      end()
    }, (e) => {
      messageError('录制失败！')
    })
  } else {
    hkPlayer.value.recordStart().then(() => {
      recordVideo.value = true
      start()
    }, (e) => {
      messageError('录制失败！')
    })
  }
}

const handleVoiceValue = (val) => {
  hkPlayer.value.setVolume(val)
}

const handleVoice = () => {
  if (!isMute.value) {
    hkPlayer.value.closeSound()
  } else {
    hkPlayer.value.openSound()
  }
  isMute.value = !isMute.value
}

const handleTalk = async () => {
  if (!hkDeviceDetail.value.RESOURCE_CODE) return
  if (!voiceing.value) {
    let param = {
      server: hkDeviceDetail.value?.SERVER_CODE,
      operate: '/artemis/api/video/v1/cameras/talkURLs',
      params: {
        cameraIndexCode: hkDeviceDetail.value?.RESOURCE_CODE,
        transmode: 1,
        expand: 'streamform=ps',
        protocol: 'ws'
      }
    }
    let res = await hkControl(param, props.host)
    let url = transUrl(res.data?.data?.url)
    if (!url) return messageError('对讲失败！')
    hkPlayer.value.talkStart(url).then(() => {
      voiceing.value = true
    })
  } else {
    hkPlayer.value.talkStop().then(() => {
      voiceing.value = false
    })
  }
}

const handleCountDown = (t) => {
  countDownNow.value = t
}

const handleFinish = async () => {
  await handleCapture(true)
  playbackEnd()
}

const handleContinuePlay = (stop) => {
  if (props.countdown) {
    if (stop) {
      // 停止倒计时
      targetCountDown.value = 0
      return
    }
    targetCountDown.value = dayjs().add(props.countdown, 'minute').valueOf()
  }
}

watch(() => props.countdown, (n) => {
  if (n === 0) {
    targetCountDown.value = 0
  } else {
    targetCountDown.value = dayjs().add(n, 'minute').valueOf()
  }
})

const timeChange = (t) => {
  playCurrentTime.value = t
}

const mousedownTimeLine = () => {
  playOldTime.value = playCurrentTime.value
}

/**
 * description 判断当前时间是否有回放段
 */
const hasPlaybackData = (time) => {
  return playbackData.value.list?.find((v) => {
    return time > v.beginTime && time < v.endTime
  })
}

const dragTimeChange = (time) => {
  let res = hasPlaybackData(time)
  if (res) {
    playbackIndex.value = res.index
    setTimeout(() => {
      handleSwitchPlayBack({ startTime: time, endTime: res.endTime }, true)
    }, 10)
  } else {
    messageError(`${formatTime(time)}没有录像！`)
    handleSwitchPlayBack({ startTime: playOldTime.value }, true)
  }
}

const handleStreamEnd = (index) => {
  playbackIndex.value = playbackIndex.value += 1
  if (playbackCurrent.value) {
    handleSwitchPlayBack()
  } else {
    streamEnd.value = true
    playbackPause()
    // playbackEnd()
  }
}

const handlePlayBackTime = async () => {
  let formEl = ruleFormRef.value
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      playbackTimeVisible.value = false
      handlePlayBack()
    }
  })
}

const handleControl = async (type) => {
  let command = {
    1: 'LEFT',
    2: 'DOWN',
    3: 'RIGHT',
    4: 'UP',
    5: 'LEFT_UP',
    6: 'LEFT_DOWN',
    7: 'RIGHT_DOWN',
    8: 'RIGHT_UP',
    9: 'ZOOM_IN',
    10: 'ZOOM_OUT'
  }
  if (hkDeviceDetail.value.RESOURCE_CODE) {
    let param = {
      server: hkDeviceDetail.value?.SERVER_CODE,
      operate: '/artemis/api/video/v1/ptzs/controlling',
      params: {
        cameraIndexCode: hkDeviceDetail.value?.RESOURCE_CODE,
        action: 0,
        command: command[type] || 'LEFT'
      }
    }
    hkControl(param, props.host).then((res) => {
      if (res.code !== 1) {
        messageError(res.messaage || '操作失败！')
      }
    })
  }
}

const handleMa = () => {
  isZi.value = !isZi.value
  handlePlayBack(true)
}

const handlePlayBack = async (type) => {
  if (type) {
    if (getUrlFlag.value) return
    loading.value = true
    getUrlFlag.value = true
    playback.value = false
    playbackEnd()
    // 获取预览url
    await getPreviewUrl()
    loading.value = false
    if (wsUrl.value) {
      hkPlayer.value.realplay(wsUrl.value).then(() => {
        played.value = true
        getUrlFlag.value = false
        handleContinuePlay()
      })
    } else {
      getUrlFlag.value = false
      messageError('无效url链接！')
    }
    return
  }
  // 获取回放url
  loading.value = true
  handleContinuePlay(true) // 停止倒计时
  let backData = await getPlaybackUrl()
  loading.value = false
  if (backData?.url) {
    playbackData.value = {
      ...backData,
      url: transUrl(backData.url),
      list: backData.list.map((v, i) => (
        {
          name: v.size,
          beginTime: new Date(v.beginTime).getTime(),
          endTime: new Date(v.endTime).getTime(),
          color: 'rgba(35, 122, 200)',
          index: i
        }
      ))
    }
    playback.value = true
    playbackEnd()
    handleSwitchPlayBack()
  } else {
    messageError('无效url链接！')
  }
}

const playbackPause = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const playbackPlay = () => {
  if (!timer) {
    timer = setInterval(() => {
      playCurrentTime.value += 1000
      timeSliderRef.value?.setTime(playCurrentTime.value)
    }, 1000)
  }
}

const handleSwitchPlayBack = (time, seek) => {
  loading.value = true
  hkPlayer.value.changeUrls({ playback: playbackData.value.url })
  let startTime = time?.startTime || playbackCurrent.value?.beginTime
  let endTime = time?.endTime || dayjs(playbackTime.value[1]).valueOf()
  hkPlayer.value[seek ? 'playbackSeekTo' : 'playbackStart']({ startTime: dayjs(startTime).format('YYYY-MM-DDTHH:mm:ss'), endTime: dayjs(endTime).format('YYYY-MM-DDTHH:mm:ss') }).then(() => {
    loading.value = false
    played.value = true
    playCurrentTime.value = startTime
    if (timer) {
      timeSliderRef.value?.setTime(playCurrentTime.value)
    } else {
      playbackPlay()
    }
  }, (e) => {
    messageError('播放异常')
    loading.value = false
  })
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
    hkPlayer.value.playbackFast().then((res) => {
      if (typeof res === 'string') {
        messageError(hkStatus[res] || res)
      }
    })
  } else {
    hkPlayer.value.playbackSlow().then((res) => {
      if (typeof res === 'string') {
        messageError(hkStatus[res] || res)
      }
    })
  }
}

const init = (url) => {
  hkPlayer.value = new HkPlayer({
    szBasePath: '/hk',
    oStyle: {
      borderSelect: '#000',
      background: 'rgba(0, 0, 0, 0)'
    },
    iCurrentSplit: 1,
    iMaxSplit: 1,
    szId: szId.value,
    ...props.hkoptions
  })
  hkPlayer.value.resize()
  hkPlayer.value.player.JS_SetWindowControlCallback({
    pluginErrorHandler: (iWndIndex, iErrorCode, oError) => {
      console.log('pluginErrorHandler', iWndIndex, iErrorCode, oError)
      errorText.value = iErrorCode
      playing.value = false
      loading.value = false
    },
    firstFrameDisplay: (iWndIndex, iErrorCode, oError) => {
      // console.log('firstFrameDisplay', iWndIndex, iErrorCode, oError)
      errorText.value = ''
      playing.value = true
    },
    windowFullCcreenChange: (bFull) => {
      isFull.value = bFull
    },
    StreamEnd: (index) => {
      // 回放结束回调,返回对应测窗口id
      playing.value = false
      handleStreamEnd(index)
    }
  })
  if (wsUrl.value) {
    hkPlayer.value.realplay(wsUrl.value).then(() => {
      played.value = true
      loading.value = false
      handleContinuePlay()
    })
  } else {
    return messageError('预览地址无效！')
  }
  // eslint-disable-next-line vue/no-mutating-props
  props.data.instance = hkPlayer.value
}

const resize = () => {
  hkPlayer.value?.resize()
  timeSliderRef.value?.onResize()
}

const getPreviewUrl = async (code) => {
  if (!hkDeviceDetail.value.RESOURCE_CODE) {
    let res = await hkDeviceInfo(deviceCode.value)
    hkDeviceDetail.value.SERVER_CODE = res.Data?.SERVER_CODE
    hkDeviceDetail.value.RESOURCE_CODE = res.Data?.RESOURCE_CODE
  }
  let param = {
    server: hkDeviceDetail.value?.SERVER_CODE,
    operate: `/artemis/api/video/${hkVersion.value}/cameras/previewURLs`,
    params: {
      cameraIndexCode: code || hkDeviceDetail.value.RESOURCE_CODE,
      streamType: isZi.value ? 1 : 0, // 1子码流 0 主码流
      protocol: 'ws',
      transmode: 1,
      expand: 'streamform=ps'
    }
  }
  let res = await hkControl(param, props.host)
  if (res.code === 1) {
    let originUrl = res.data?.data?.url
    wsUrl.value = transUrl(originUrl)
    if (!res.data?.data) {
      let code = res.data?.code
      messageError(hkStatus[code] || code)
    }
  }
  return res
}

const getPlaybackUrl = async (code) => {
  let param = {
    server: hkDeviceDetail.value?.SERVER_CODE,
    operate: `/artemis/api/video/${hkVersion.value}/cameras/playbackURLs`,
    params: {
      cameraIndexCode: code || hkDeviceDetail.value.RESOURCE_CODE,
      recordLocation: '1',
      protocol: 'ws',
      streamform: 'ps',
      beginTime: dayjs(playbackTime.value[0]).format('YYYY-MM-DDTHH:mm:ss[.000+08:00]'),
      endTime: dayjs(playbackTime.value[1]).format('YYYY-MM-DDTHH:mm:ss[.000+08:00]')
    }
  }
  let res = await hkControl(param, props.host)
  if (res.code === 1) {
    if (!res.data?.data) {
      let code = res.data?.code
      messageError(hkStatus[code] || code)
    }
  }
  return res?.data?.data
}

const transUrl = (ourl) => {
  let url = ''
  if (!ourl) return ''
  if (props.originHost) {
    url = ourl
  } else {
    let u = ourl.split('openUrl')[1]
    url = `ws://221.204.213.61:559/openUrl${u}`
  }
  return url
}

onMounted(async () => {
  loading.value = true
  if (props.data?.url) {
    init()
  } else {
    let res = await getPreviewUrl()
    init()
    loading.value = false
  }
})

onBeforeUnmount(() => {
  end()
  playbackEnd()
})

const playbackEnd = () => {
  playbackIndex.value = 0
  played.value = false
  playing.value = false
  streamEnd.value = false
  hkPlayer.value?.stopPlay()
  playbackPause()
}

defineExpose({ resize })
</script>
<style scoped lang='less'>
.wrap{
  position: relative;
  width: 100%;
  height: 100%;
  &.no{
    & > *:not(.hkinfo){
      display: none;
    }
  }
  :deep(.hkmessage){
    position: absolute;
    padding: 8px 5px;
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
  .countdown{
    position: absolute;
    inset: 0;
    margin: auto;
    height: 50px;
    width: 50%;
    .end{
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
    }
    .el-statistic{
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      padding-bottom: 4px;
      .continuePlay{
        font-size: 14px;
        color: #fff;
        display: flex;
        flex-direction: column;
        .play{
          cursor: pointer;
          color: #fcf498;
        }
      }
    }
  }
  .recordVideo{
    position: absolute;
    top: 5px;
    right: 26px;
    color: #f56c6c;
  }
  .playicon {
    width: 50px;
    height: 50px;
    position: absolute;
    inset: 0;
    margin: auto;
    z-index: 1;
    & > .el-icon{
      cursor: pointer;
    }
  }
  .error{
    color: #f56c6c;
    height: 20px;
    text-align: center;
    position: absolute;
    inset: 0;
    margin: auto;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    & > .el-icon{
      cursor: pointer;
    }
  }
  .streamEnd{
    color: #f56c6c;
    height: 20px;
    text-align: center;
    position: absolute;
    z-index: 1;
    inset: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
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
    background: rgba(0,0,0,.38);
    .voice{
      position: relative;
      &.noMute{
        &:hover{
          .voiceSlider{
            display: block;
          }
        }
      }
      .voiceSlider{
        display: none;
        position: absolute;
        bottom: 57px;
        left: -7px;
        :deep(.el-slider__button){
          transform: scale(0.8);
        }
      }
    }
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
    .hkicon{
      width: 24px;
      height: 24px;
    }
    .rate{
      width: 30px;
      text-align: center;
      background: rgba(0,0,0,.38);
      color: rgb(252, 244, 152);
    }
    :deep(.el-date-editor){
      width: 300px;
    }
    .controll{
      width: 160px;
      height: 160px;
      position: relative;
      .el-icon{
        position: absolute;
        &:nth-child(1){
          transform: translate(0, -50%);
          top: 50%;
        }
        &:nth-child(2){
          transform: translate(-50%, -100%) rotate(-90deg);
          top: 100%;
          left: 50%;
        }
        &:nth-child(3){
          transform: translate(-100%, -50%) rotate(-180deg);
          top: 50%;
          left: 100%;
        }
        &:nth-child(4){
          transform: translate(-50%, 0) rotate(-270deg);
          left: 50%;
        }
        &:nth-child(5){
          transform: translate(-50%, -50%) rotate(45deg);
          left: 25%;
          top: 25%;
        }
        &:nth-child(6){
          transform: translate(-50%, -50%) rotate(-45deg);
          left: 25%;
          top: 75%;
        }
        &:nth-child(7){
          transform: translate(-50%, -50%) rotate(-135deg);
          left: 75%;
          top: 75%;
        }
        &:nth-child(8){
          transform: translate(-50%, -50%) rotate(-225deg);
          left: 75%;
          top: 25%;
        }
        &:nth-child(9){
          transform: translate(-50%, -50%);
          left: 25%;
          top: 50%;
        }
        &:nth-child(10){
          transform: translate(-50%, -50%);
          left: 75%;
          top: 50%;
        }
      }
    }
  }
  #timeSlider{
    position: absolute;
    bottom: 0px;
    height: 50px;
  }
}
</style>
