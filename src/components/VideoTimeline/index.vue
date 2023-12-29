<template>
  <div
    ref="timeLineContainer"
    class="timeLineContainer"
    :style="{
      backgroundColor: backgroundColor,
    }"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @mousedown="onMousedown"
    @mouseout="onMouseout"
    @mousemove="onMousemove"
    @mouseleave="onMouseleave"
  >
    <canvas
      ref="canvas"
      class="canvas"
      @mousewheel.stop.prevent="onMouseweel"
    />
    <div
      v-if="showWindowList && windowList && windowList.length > 1"
      ref="windowList"
      class="windowList"
      @scroll="onWindowListScroll"
    >
      <WindowListItem
        v-for="(item, index) in windowListInner"
        ref="WindowListItemRef"
        :key="index"
        :index="index"
        :data="item"
        :total-m-s="totalMS"
        :start-timestamp="startTimestamp"
        :width="width"
        :active="item.active"
        @click_window_timeSegments="triggerClickWindowTimeSegments"
        @click="toggleActive(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import WindowListItem from './WindowListItem'
import {
  ONE_HOUR_STAMP,
  ZOOM,
  ZOOM_HOUR_GRID,
  ZOOM_DATE_SHOW_RULE,
  MOBILE_ZOOM_HOUR_GRID,
  MOBILE_ZOOM_DATE_SHOW_RULE
} from './constant'

const props = defineProps({
  // 初始时间，中点所在的时间，默认为当天0点
  initTime: {
    type: [Number, String],
    default: ''
  },
  // 显示预览的时间范围，即中间刻度所允许的时间范围
  /*
      {
        start: '2020-12-19 18:30:00',// 允许显示的最小时间
        end: '2021-01-20 10:0:00'// 允许显示的最大时间
      }
    */
  timeRange: {
    type: Object,
    default() {
      return {}
    }
  },
  // 初始的时间分辨率
  initZoomIndex: {
    type: Number,
    default: 5 // 24小时
  },
  // 是否显示中间的竖线
  showCenterLine: {
    type: Boolean,
    default: true
  },
  // 中间竖线的样式
  centerLineStyle: {
    type: Object,
    default() {
      return {
        width: 2,
        color: '#fff'
      }
    }
  },
  // 日期时间文字颜色
  textColor: {
    type: String,
    default: 'rgba(151,158,167,1)'
  },
  // 鼠标滑过显示的时间文字颜色
  hoverTextColor: {
    type: String,
    default: 'rgb(194, 202, 215)'
  },
  // 时间线段颜色
  lineColor: {
    type: String,
    default: 'rgba(151,158,167,1)'
  },
  // 时间线段高度占时间轴高度的比例
  lineHeightRatio: {
    type: Object,
    default() {
      return {
        date: 0.3, // 0点时的日期线段高度
        time: 0.2, // 显示时间的线段高度
        none: 0.1, // 不显示时间的线段高度
        hover: 0.3 // 鼠标滑过时显示的时间段高度
      }
    }
  },
  // 鼠标滑过时是否显示实时所在的时间
  showHoverTime: {
    type: Boolean,
    default: true
  },
  // 格式化鼠标滑过时间
  hoverTimeFormat: {
    type: Function
  },
  // 要显示的时间颜色段
  /*
      {
        beginTime: new Date('2021-01-19 14:30:00').getTime(),// 起始时间戳
        endTime: new Date('2021-01-20 18:00:00').getTime(),// 结束时间戳
        color: '#FA3239',// 颜色
        startRatio: 0.65,// 高度的起始比例，即top=时间轴高度*startRatio
        endRatio: 0.9// 高度的结束比例，即bottom=时间轴高度*endRatio
      }
    */
  timeSegments: {
    type: Array,
    default: () => []
  },
  // 时间轴背景颜色
  backgroundColor: {
    type: String,
    default: '#262626'
  },
  // 是否允许切换分辨率
  enableZoom: {
    type: Boolean,
    default: true
  },
  // 是否允许拖动
  enableDrag: {
    type: Boolean,
    default: true
  },
  // 窗口列表，如果窗口数量大于1的话可以配置此项，会显示和窗口对应数量的时间轴，只有一个窗口的话请直接使用基本时间轴
  /*
      {
        timeSegments: [// 时间段
          {
            beginTime: new Date('2021-01-19 14:30:00').getTime(),// 起始时间戳
            endTime: new Date('2021-01-20 18:00:00').getTime(),// 结束时间戳
            color: '#FA3239',// 颜色
            startRatio: 0.65,// 高度的起始比例，即top=时间轴高度*startRatio
            endRatio: 0.9// 高度的结束比例，即bottom=时间轴高度*endRatio
          }
        ],
        // 你的其他附加信息...
      }
    */
  windowList: {
    type: Array,
    default() {
      return []
    }
  },
  // 当显示windowList时的基础时间轴高度
  baseTimeLineHeight: {
    type: Number,
    default: 50
  },
  // 初始选中的窗口时间轴
  initSelectWindowTimeLineIndex: {
    type: Number,
    default: -1
  },
  // 是否是手机端
  isMobile: {
    type: Boolean,
    default: false
  },
  // 鼠标按下和松开的距离小于该值认为是点击事件
  maxClickDistance: {
    type: Number,
    default: 3
  },
  // 绘制时间段时对计算出来的坐标进行四舍五入，可以防止相连的时间段绘制出来有间隔的问题
  roundWidthTimeSegments: {
    type: Boolean,
    default: true
  },
  // 自定义显示哪些时间
  customShowTime: {
    type: Function
  },
  // 0点处是否显示日期
  showDateAtZero: {
    type: Boolean,
    default: true
  },
  // 扩展ZOOM列表，这个数组的数据会追加到内部的ZOOM数组，对应的zoomIndex往后累加即可，内部一共有11个zoom，那么你追加了一项，对应的zoomIndex为11，因为是从零开始计数
  // 数组类型，数组的每一项为：
  /*
      {
        zoom: 26,// 时间分辨率，整个时间轴表示的时间范围，单位：小时
        zoomHourGrid: 0.5,// 时间分辨率对应的每格小时数，即时间轴上最小格代表多少小时
        mobileZoomHourGrid: 2, // 手机模式下时间分辨率对应的每格小时数，如果不用适配手机端，可以不用设置
      }
    */
  // 同时你需要传递customShowTime属性来自定义控制时间显示，否则会报错，因为内置的规则只有11个
  extendZOOM: {
    type: Array,
    default() {
      return []
    }
  },
  // 格式化时间轴显示时间
  formatTime: {
    type: Function
  }
})
const widthRef = ref(0)
const heightRef = ref(0)
const ctx = ref(null)
const currentZoomIndex = ref(0)
const currentTime = ref(0)
const startTimestamp = ref(0)
const mousedown = ref(false)
const mousedownX = ref(0)
const mousedownY = ref(0)
const mousedownCacheStartTimestamp = ref(0)
const showWindowList = ref(false)
const windowListInner = ref([])
const mousemoveX = ref(-1)
const watchTimeList = ref([])

const timeLineContainer = ref()
const canvas = ref()
const WindowListItemRef = ref()
const emits = defineEmits(['timeChange', 'mousedown', 'dragTimeChange', 'mouseup', 'click_window_timeSegments', 'change_window_time_line', 'click_timeline', 'click_timeSegments'])
// 整个时间轴所代表的毫秒数
const totalMS = computed(() => {
  return ZOOM[currentZoomIndex.value] * ONE_HOUR_STAMP
})
// 时间范围的时间戳表示
const timeRangeTimestamp = computed(() => {
  let t = {}
  if (props.timeRange.start) {
    t.start = typeof props.timeRange.start === 'number' ? props.timeRange.start : new Date(props.timeRange.start).getTime()
  }
  if (props.timeRange.end) {
    t.end = typeof props.timeRange.end === 'number' ? props.timeRange.end : new Date(props.timeRange.end).getTime()
  }
  return t
})
const ACT_ZOOM_HOUR_GRID = computed(() => {
  return props.isMobile ? MOBILE_ZOOM_HOUR_GRID : ZOOM_HOUR_GRID
})
const ACT_ZOOM_DATE_SHOW_RULE = computed(() => {
  return props.isMobile ? MOBILE_ZOOM_DATE_SHOW_RULE : ZOOM_DATE_SHOW_RULE
})
// 年月模式
const yearMonthMode = computed(() => {
  return currentZoomIndex.value === 9;
})
// 年模式
const yearMode = computed(() => {
  return currentZoomIndex.value === 10;
})
watch(() => [...props.timeSegments], () => {
  console.log(props.timeSegments, 444)
  reRender()
})
onBeforeMount(() => {
  props.extendZOOM.forEach((item) => {
    ZOOM.push(item.zoom)
    ZOOM_HOUR_GRID.push(item.zoomHourGrid)
    MOBILE_ZOOM_HOUR_GRID.push(item.mobileZoomHourGrid)
  })
})

onMounted(() => {
  setInitData()
  init()
  draw()
  if (props.isMobile) {
    timeLineContainer.value.addEventListener('touchend', onTouchend)
  } else {
    window.addEventListener('mouseup', onMouseup)
  }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (props.isMobile) {
    timeLineContainer.value.removeEventListener('touchend', onTouchend)
  } else {
    window.removeEventListener('mouseup', onMouseup)
  }
  window.removeEventListener('resize', onResize)
})

const setInitData = () => {
  // 内部窗口列表数据
  windowListInner.value = props.windowList.map((item, index) => {
    return {
      ...item,
      active: props.initSelectWindowTimeLineIndex === index
    }
  })
  // 必须先设置currentZoomIndex
  // 初始时间分辨率
  currentZoomIndex.value =
        props.initZoomIndex >= 0 && props.initZoomIndex < ZOOM.length
          ? props.initZoomIndex
          : 5
  // 初始当前时间
  startTimestamp.value =
        (props.initTime
          ? typeof props.initTime === 'number' ? props.initTime : new Date(props.initTime).getTime()
          : new Date(dayjs().format('YYYY-MM-DD 00:00:00')).getTime()) -
        totalMS.value / 2
  // 根据时间范围检查并修正起始时间
  fixStartTimestamp()
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 16:01:21
     * @Desc: 根据时间范围检查并修正起始时间
     */
const fixStartTimestamp = () => {
  let hfms = totalMS.value / 2
  let ct = startTimestamp.value + hfms
  if (timeRangeTimestamp.value.start && ct < timeRangeTimestamp.value.start) {
    startTimestamp.value = timeRangeTimestamp.value.start - hfms
  }
  if (timeRangeTimestamp.value.end && ct > timeRangeTimestamp.value.end) {
    startTimestamp.value = timeRangeTimestamp.value.end - hfms
  }
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 09:20:22
     * @Desc: 初始化
     */
const init = () => {
  let {
    width,
    height
  } = timeLineContainer.value.getBoundingClientRect()
  widthRef.value = width
  heightRef.value =
        props.windowList.length > 1 ? props.baseTimeLineHeight : height
  canvas.value.width = widthRef.value
  canvas.value.height = heightRef.value
  ctx.value = canvas.value.getContext('2d')
  showWindowList.value = true
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 09:27:18
     * @Desc: 绘制方法
     */
const draw = () => {
  // 顺序很重要，不然层级不对
  drawTimeSegments()
  addGraduations()
  drawMiddleLine()

  currentTime.value = startTimestamp.value + totalMS.value / 2
  emits('timeChange', currentTime.value)

  // 通知窗口时间轴渲染
  try {
    WindowListItemRef.value.forEach((item) => {
      item.draw()
    })
  } catch (error) { }

  // 更新观察的时间位置
  updateWatchTime()
}

/**
     * @Author: 王林25
     * @Date: 2021-01-21 10:50:11
     * @Desc:  更新观察的时间位置
     */
const updateWatchTime = () => {
  watchTimeList.value.forEach((item) => {
    // 当前不在显示范围内
    if (item.time < startTimestamp.value || item.time > startTimestamp.value + totalMS.value) {
      item.callback(-1, -1)
    } else { // 在范围内
      let x = (item.time - startTimestamp.value) * (widthRef.value / totalMS.value)
      let y = 0
      let { left, top } = canvas.value.getBoundingClientRect()
      if (item.windowTimeLineIndex !== -1 && props.windowList.length > 1 && item.windowTimeLineIndex >= 0 && item.windowTimeLineIndex < props.windowList.length) {
        let rect = WindowListItemRef.value[item.windowTimeLineIndex].getRect()
        y = rect ? rect.top : top
      } else {
        y = top
      }
      item.callback(x + left, y)
    }
  })
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 09:27:46
     * @Desc: 绘制中间的竖线
     */
const drawMiddleLine = () => {
  if (!props.showCenterLine) {
    return
  }
  ctx.value.beginPath()
  let { width, color } = props.centerLineStyle
  let x = widthRef.value / 2
  drawLine(x, 0, x, heightRef.value, width, color)
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 11:03:44
     * @Desc: 绘制时间刻度
     */
const addGraduations = () => {
  ctx.value.beginPath()
  // 一共可以绘制的格数
  let gridNum =
        ZOOM[currentZoomIndex.value] / ACT_ZOOM_HOUR_GRID.value[currentZoomIndex.value]
  // 一格多少毫秒
  let msPerGrid = ACT_ZOOM_HOUR_GRID.value[currentZoomIndex.value] * ONE_HOUR_STAMP
  // 每格间距，一格多少像素宽
  let pxPerGrid = widthRef.value / gridNum
  // 起始偏移距离
  let msOffset = msPerGrid - (startTimestamp.value % msPerGrid)
  let pxOffset = (msOffset / msPerGrid) * pxPerGrid
  for (let i = 0; i < gridNum; i++) {
    let currentStartTimestamp = startTimestamp.value + msOffset + i * msPerGrid
    let adjustMsOffset = 0
    // 分辨率以年为单位
    if (yearMode.value) {
      adjustMsOffset = currentStartTimestamp - new Date(`${dayjs(currentStartTimestamp).format('YYYY')}-01-01 00:00:00`).getTime()
    } else if (yearMonthMode.value) {
      // 分辨率以月为单位
      adjustMsOffset = currentStartTimestamp - new Date(`${dayjs(currentStartTimestamp).format('YYYY')}-${dayjs(currentStartTimestamp).format('MM')}-01 00:00:00`).getTime()
    }
    let x = pxOffset + i * pxPerGrid - (adjustMsOffset / msPerGrid) * pxPerGrid
    let graduationTime = currentStartTimestamp - adjustMsOffset
    let h = 0
    let date = new Date(graduationTime)
    // 0点显示日期
    if (props.showDateAtZero && date.getHours() === 0 && date.getMinutes() === 0) {
      h = heightRef.value * (props.lineHeightRatio.date === undefined ? 0.3 : props.lineHeightRatio.date)
      ctx.value.fillStyle = props.textColor
      ctx.value.fillText(
        graduationTitle(graduationTime),
        x - 13,
        h + 15
      )
    } else if (checkShowTime(date)) {
      // 其余时间根据各自规则显示
      h = heightRef.value * (props.lineHeightRatio.time === undefined ? 0.2 : props.lineHeightRatio.time)
      ctx.value.fillStyle = props.textColor
      ctx.value.fillText(
        graduationTitle(graduationTime),
        x - 13,
        h + 15
      )
    } else {
      // 不显示时间的线段
      h = heightRef.value * (props.lineHeightRatio.none === undefined ? 0.1 : props.lineHeightRatio.none)
    }
    drawLine(x, 0, x, h, 1, props.lineColor)
  }
}

// 判断是否需要显示该时间
const checkShowTime = (date) => {
  if (props.customShowTime) {
    let res = props.customShowTime(date, currentZoomIndex.value)
    if (res === true) {
      return true
    } else if (res === false) {
      return false
    }
  }
  return ACT_ZOOM_DATE_SHOW_RULE.value[currentZoomIndex.value](date)
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 15:42:49
     * @Desc: 绘制时间段
     */
const drawTimeSegments = (callback, path) => {
  const PX_PER_MS = widthRef.value / totalMS.value // px/ms，每毫秒占的像素
  props.timeSegments.forEach((item) => {
    if (
      item.beginTime <= startTimestamp.value + totalMS.value
    ) {
      let hasEndTime = item.endTime >= startTimestamp.value
      ctx.value.beginPath()
      let x = (item.beginTime - startTimestamp.value) * PX_PER_MS
      let w
      if (x < 0) {
        x = 0
        w = hasEndTime ? (item.endTime - startTimestamp.value) * PX_PER_MS : 1
      } else {
        w = hasEndTime ? (item.endTime - item.beginTime) * PX_PER_MS : 1
      }
      let heightStartRatio = item.startRatio === undefined ? 0.6 : item.startRatio
      let heightEndRatio = item.endRatio === undefined ? 0.9 : item.endRatio
      if (props.roundWidthTimeSegments) {
        x = Math.round(x)
        w = Math.round(w)
      }
      // 避免时间段小于1px绘制不出来
      w = Math.max(1, w)
      if (path) {
        ctx.value.rect(
          x,
          heightRef.value * heightStartRatio,
          w,
          heightRef.value * (heightEndRatio - heightStartRatio)
        )
      } else {
        ctx.value.fillStyle = item.color
        ctx.value.fillRect(
          x,
          heightRef.value * heightStartRatio,
          w,
          heightRef.value * (heightEndRatio - heightStartRatio)
        )
      }
      callback && callback(item)
    }
  })
}

// 触摸开始事件
const onTouchstart = (e) => {
  if (!props.isMobile) {
    return
  }
  e = e.touches[0]
  onPointerdown(e)
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 14:29:40
     * @Desc: 鼠标按下事件
     */
const onMousedown = (e) => {
  if (props.isMobile) {
    return
  }
  onPointerdown(e)
}

// 按下事件
const onPointerdown = (e) => {
  let pos = getClientOffset(e)
  mousedownX.value = pos[0]
  mousedownY.value = pos[1]
  mousedown.value = true
  mousedownCacheStartTimestamp.value = startTimestamp.value
  emits('mousedown', e)
}

// 触摸结束事件
const onTouchend = (e) => {
  if (!props.isMobile) {
    return
  }
  e = e.touches[0]
  onPointerup(e)
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 14:38:30
     * @Desc: 鼠标松开
     */
const onMouseup = (e) => {
  if (props.isMobile) {
    return
  }
  onPointerup(e)
}

// 松开事件
const onPointerup = (e) => {
  // 触发click事件
  console.log(11)
  let pos = getClientOffset(e)
  const reset = () => {
    mousedown.value = false
    mousedownX.value = 0
    mousedownY.value = 0
    mousedownCacheStartTimestamp.value = 0
  }
  if (
    Math.abs(pos[0] - mousedownX.value) <= props.maxClickDistance &&
        Math.abs(pos[1] - mousedownY.value) <= props.maxClickDistance
  ) {
    reset()
    onClick(...pos)
    return
  }
  if (mousedown.value && props.enableDrag) {
    reset()
    emits('dragTimeChange', currentTime.value)
  } else {
    reset()
  }
  emits('mouseup', e)
}

// 触摸移动事件
const onTouchmove = (e) => {
  if (!props.isMobile) {
    return
  }
  e = e.touches[0]
  onPointermove(e)
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 14:17:02
     * @Desc: 鼠标移动事件
     */
const onMousemove = (e) => {
  if (props.isMobile) {
    return
  }
  onPointermove(e)
}

// 移动事件
const onPointermove = (e) => {
  let x = getClientOffset(e)[0]
  mousemoveX.value = x
  // 按下拖动
  if (mousedown.value && props.enableDrag) {
    drag(x)
  } else if (props.showHoverTime) {
    // 未按下显示鼠标所在时间
    hoverShow(x)
  }
}

/**
     * @Author: 王林25
     * @Date: 2021-01-21 10:40:37
     * @Desc: 鼠标移出事件
     */
const onMouseleave = () => {
  mousemoveX.value = -1
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 15:29:46
     * @Desc: 按下拖动
     */
const drag = (x) => {
  if (!props.enableDrag) {
    return
  }
  const PX_PER_MS = widthRef.value / totalMS.value // px/ms
  let diffX = x - mousedownX.value
  // 判断是否超出限制范围
  let hfms = totalMS.value / 2
  let _newStartTimestamp =
        mousedownCacheStartTimestamp.value - Math.round(diffX / PX_PER_MS)
  let ct = _newStartTimestamp + hfms
  if (timeRangeTimestamp.value.start && ct < timeRangeTimestamp.value.start) {
    _newStartTimestamp = timeRangeTimestamp.value.start - hfms
  }
  if (timeRangeTimestamp.value.end && ct > timeRangeTimestamp.value.end) {
    _newStartTimestamp = timeRangeTimestamp.value.end - hfms
  }
  startTimestamp.value = _newStartTimestamp
  clearCanvas(widthRef.value, heightRef.value)
  draw()
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 15:29:52
     * @Desc: 未按下显示鼠标所在时间
     */
const hoverShow = (x, noDraw) => {
  const PX_PER_MS = widthRef.value / totalMS.value // px/ms
  let time = startTimestamp.value + x / PX_PER_MS
  if (!noDraw) {
    clearCanvas(widthRef.value, heightRef.value)
    draw()
  }
  let h = heightRef.value * (props.lineHeightRatio.hover === undefined ? 0.3 : props.lineHeightRatio.hover)
  drawLine(x, 0, x, h, 1, props.lineColor)
  ctx.value.fillStyle = props.hoverTextColor
  let t = props.hoverTimeFormat ? props.hoverTimeFormat(time) : dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  let w = ctx.value.measureText(t).width
  ctx.value.fillText(t, x - w / 2, h + 20)
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 14:28:48
     * @Desc: 鼠标移出事件
     */
const onMouseout = () => {
  clearCanvas(widthRef.value, heightRef.value)
  draw()
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 15:14:12
     * @Desc: 鼠标滚动
     */
const onMouseweel = (event) => {
  if (!props.enableZoom) {
    return
  }
  let e = window.event || event
  let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))
  if (delta < 0) {
    if (currentZoomIndex.value + 1 >= ZOOM.length - 1) {
      currentZoomIndex.value = ZOOM.length - 1
    } else {
      currentZoomIndex.value++
    }
  } else if (delta > 0) {
    // 放大
    if (currentZoomIndex.value - 1 <= 0) {
      currentZoomIndex.value = 0
    } else {
      currentZoomIndex.value--
    }
  }
  clearCanvas(widthRef.value, heightRef.value)
  startTimestamp.value = currentTime.value - totalMS.value / 2 // 当前时间-新的时间范围的一半
  draw()
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 16:22:04
     * @Desc: 点击事件
     */
const onClick = (x, y) => {
  const PX_PER_MS = widthRef.value / totalMS.value // px/ms
  let time = startTimestamp.value + x / PX_PER_MS
  let date = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  let timeSegments = getClickTimeSegments(x, y)
  if (timeSegments && timeSegments.length > 0) {
    emits('click_timeSegments', timeSegments, time, date, x)
  } else {
    onCanvasClick(time, date, x)
  }
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 16:24:54
     * @Desc: 检测当前是否点击了某个时间段
     */
const getClickTimeSegments = (x, y) => {
  let inItems = []
  drawTimeSegments((item) => {
    if (ctx.value.isPointInPath(x, y)) {
      inItems.push(item)
    }
  }, true)
  return inItems
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 11:14:30
     * @Desc: 获取鼠标相当于时间轴的距离
     */
const getClientOffset = (e) => {
  if (!timeLineContainer.value || !e) {
    return [0, 0]
  }
  let { left, top } = timeLineContainer.value.getBoundingClientRect()
  return [e.clientX - left, e.clientY - top]
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 14:25:43
     * @Desc: 清除画布
     */
const clearCanvas = (w, h) => {
  ctx.value.clearRect(0, 0, w, h)
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 14:15:25
     * @Desc: 时间格式化
     */
const graduationTitle = (datetime) => {
  let time = dayjs(datetime)
  let res = ''
  if (props.formatTime) {
    res = props.formatTime(time)
  }
  if (res) {
    return res
  }
  if (yearMode.value) {
    return time.format('YYYY')
  } else if (yearMonthMode.value) {
    return time.format('YYYY-MM')
  } else if (
    time.hour() === 0 &&
        time.minute() === 0 &&
        time.millisecond() === 0
  ) {
    return time.format('MM-DD')
  } else {
    return time.format('HH:mm')
  }
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 11:28:37
     * @Desc: 绘制线段
     */
const drawLine = (x1, y1, x2, y2, lineWidth = 1, color = '#fff') => {
  ctx.value.beginPath()
  ctx.value.strokeStyle = color
  ctx.value.lineWidth = lineWidth
  ctx.value.moveTo(x1, y1)
  ctx.value.lineTo(x2, y2)
  ctx.value.stroke()
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 15:57:11
     * @Desc: 重新渲染
     */
const reRender = () => {
  nextTick(() => {
    clearCanvas(widthRef.value, heightRef.value)
    reset()
    setInitData()
    init()
    draw()
  })
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 16:07:53
     * @Desc: 复位
     */
const reset = () => {
  widthRef.value = 0
  heightRef.value = 0
  ctx.value = null
  currentZoomIndex.value = 0
  currentTime.value = 0
  startTimestamp.value = 0
  mousedown.value = false
  mousedownX.value = 0
  mousedownCacheStartTimestamp.value = 0
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 15:57:26
     * @Desc: 设置当前时间
     */
const setTime = (t) => {
  if (mousedown.value) {
    return
  }
  let ts = typeof t === 'number' ? t : new Date(t).getTime()
  startTimestamp.value = ts - totalMS.value / 2
  fixStartTimestamp()
  clearCanvas(widthRef.value, heightRef.value)
  draw()
  if (mousemoveX.value !== -1 && !props.isMobile) {
    hoverShow(mousemoveX.value, true)
  }
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 19:32:39
     * @Desc: 转发窗口时间轴的事件
     */
const triggerClickWindowTimeSegments = (data, index, item) => {
  emits('click_window_timeSegments', data, index, item)
}

/**
     * @Author: 王林25
     * @Date: 2021-01-21 09:58:17
     * @Desc: 设置分辨率
     */
const setZoom = (index) => {
  currentZoomIndex.value =
        index >= 0 && index < ZOOM.length
          ? index
          : 5
  clearCanvas(widthRef.value, heightRef.value)
  startTimestamp.value = currentTime.value - totalMS.value / 2 // 当前时间-新的时间范围的一半
  draw()
}

/**
     * @Author: 王林25
     * @Date: 2021-01-21 10:15:30
     * @Desc: 切换窗口时间轴的选中
     */
const toggleActive = (index) => {
  windowListInner.value.forEach((item) => {
    item.active = false
  })
  windowListInner.value[index].active = true
  emits('change_window_time_line', index, windowListInner.value[index])
}

/**
     * @Author: 王林25
     * @Date: 2021-01-21 10:47:28
     * @Desc: 要观察的时间点，会返回该时间点的实时位置，你可以根据该位置来设置一些你的自定义元素，位置为相对于浏览器可视窗口的位置
     */
const watchTime = (time, callback, windowTimeLineIndex) => {
  if (!time || !callback) {
    return
  }
  watchTimeList.value.push({
    time: typeof time === 'number' ? time : new Date(time).getTime(),
    callback,
    windowTimeLineIndex: typeof windowTimeLineIndex === 'number' ? windowTimeLineIndex - 1 : -1
  })
}

/**
     * @Author: 王林25
     * @Date: 2021-01-21 13:36:37
     * @Desc: 窗口时间轴滚动
     */
const onWindowListScroll = () => {
  updateWatchTime()
}

/**
     * @Author: 王林25
     * @Date: 2021-01-21 13:40:53
     * @Desc: 尺寸重适应
     */
const onResize = () => {
  init()
  draw()
  try {
    WindowListItemRef.value.forEach((item) => {
      item.init()
    })
  } catch (error) { }
}

// 时间轴点击事件
const onCanvasClick = (...args) => {
  emits('click_timeline', ...args)
}

defineExpose({ setTime, onResize })
</script>

<style lang="less" scoped>
.timeLineContainer {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  .canvas {
    flex-grow: 0;
    flex-shrink: 0;
  }

  .windowList {
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    border-top: 1px solid rgba(153, 153, 153, 1);
    display: flex;
    flex-direction: column;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
