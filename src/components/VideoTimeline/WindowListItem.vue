<template>
  <div
    ref="windowListItem"
    class="windowListItem"
    :class="{active: props.active}"
    @click="onClick"
  >
    <span class="order">{{ props.index + 1 }}</span>
    <canvas
      ref="canvas"
      class="windowListItemCanvas"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
defineOptions({
  name: 'WindowListItem'
})
const props = defineProps({
  index: {
    type: Number
  },
  data: {
    type: Object,
    default () {
      return {}
    }
  },
  totalMS: {
    type: Number
  },
  startTimestamp: {
    type: Number
  },
  width: {
    type: Number
  },
  active: {
    type: Boolean,
    default: false
  }
})
const heightRef = ref(0)
const ctx = ref(null)
const canvas = ref()
const windowListItem = ref()

const emits = defineEmits(['click_window_timeSegments', 'click'])
onMounted(() => {
  init()
  drawTimeSegments()
})

const init = () => {
  let { height } = windowListItem.value.getBoundingClientRect()
  heightRef.value = height - 1
  canvas.value.width = props.width
  canvas.value.height = heightRef.value
  ctx.value = canvas.value.getContext('2d')
}

/**
     * @Author: 王林25
     * @Date: 2020-04-14 15:42:49
     * @Desc: 绘制时间段
     */
const drawTimeSegments = (callback, path) => {
  if (!props.timeSegments || props.timeSegments.length <= 0) {
    return
  }
  const PX_PER_MS = props.width / props.totalMS // px/ms，每毫秒占的像素
  props.timeSegments.forEach((item) => {
    if (
      item.beginTime <= props.startTimestamp + props.totalMS &&
          item.endTime >= props.startTimestamp
    ) {
      ctx.value.beginPath()
      let x = (item.beginTime - props.startTimestamp) * PX_PER_MS
      let w
      if (x < 0) {
        x = 0
        w = (item.endTime - props.startTimestamp) * PX_PER_MS
      } else {
        w = (item.endTime - item.beginTime) * PX_PER_MS
      }
      let heightStartRatio = item.startRatio === undefined ? 0.6 : item.startRatio
      let heightEndRatio = item.endRatio === undefined ? 0.9 : item.endRatio
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

/**
     * @Author: 王林25
     * @Date: 2020-04-14 14:25:43
     * @Desc: 清除画布
     */
const clearCanvas = () => {
  ctx.value.clearRect(0, 0, props.width, heightRef.value)
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 19:07:31
     * @Desc: 绘制
     */
const draw = () => {
  nextTick(() => {
    clearCanvas()
    drawTimeSegments()
  })
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 19:26:46
     * @Desc: 点击事件
     */
const onClick = (e) => {
  emits('click', e)
  console.log(e, 'click')
  let { left, top } = windowListItem.value.getBoundingClientRect()
  let x = e.clientX - left
  let y = e.clientY - top
  let timeSegments = props.getClickTimeSegments(x, y)
  if (timeSegments.length > 0) {
    emits('click_window_timeSegments', timeSegments, props.index, props.data)
  }
}

/**
     * @Author: 王林25
     * @Date: 2021-01-20 16:24:54
     * @Desc: 检测当前是否点击了某个时间段
     */
const getClickTimeSegments = (x, y) => {
  if (!props.timeSegments || props.timeSegments.length <= 0) {
    return []
  }
  let inItems = []
  props.drawTimeSegments((item) => {
    if (ctx.value.isPointInPath(x, y)) {
      inItems.push(item)
    }
  }, true)
  return inItems
}

/**
     * @Author: 王林25
     * @Date: 2021-01-21 11:25:26
     * @Desc: 获取位置信息
     */
const getRect = () => {
  return windowListItem.value ? windowListItem.value.getBoundingClientRect() : null
}
</script>

<style lang="less" scoped>
.windowListItem {
  width: 100%;
  height: 30px;
  position: relative;
  border-bottom: 1px solid rgba(153, 153, 153, 1);
  user-select: none;

  &.active {
    background-color: #000;
  }

  .order {
    position: absolute;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-right: 1px solid rgba(153, 153, 153, 1)
  }
}
</style>
