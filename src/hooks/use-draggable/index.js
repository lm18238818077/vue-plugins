import { onBeforeUnmount, onMounted, watchEffect } from 'vue'
import { addUnit } from '@/utils/utils'
import { useZIndex } from "../use-z-index";

const { currentZIndex, nextZIndex } = useZIndex()

export default (
  className,
  dragRef,
  draggable
) => {
  let transform = {
    offsetX: 0,
    offsetY: 0,
  }
  
  let targetRef = null
  const onMousedown = (e) => {
    const downX = e.clientX
    const downY = e.clientY
    const { offsetX, offsetY } = transform

    const targetRect = targetRef.getBoundingClientRect()

    const targetLeft = targetRect.left
    const targetTop = targetRect.top
    const targetWidth = targetRect.width * 0.1
    const targetHeight = targetRect.height * 0.1

    const clientWidth = document.documentElement.clientWidth
    const clientHeight = document.documentElement.clientHeight

    const minLeft = -targetLeft + offsetX - targetWidth * 9
    const minTop = -targetTop + offsetY
    const maxLeft = clientWidth - targetLeft - targetWidth + offsetX
    const maxTop = clientHeight - targetTop - targetHeight + offsetY

    const onMousemove = (e) => {
      const moveX = Math.min(
        Math.max(offsetX + e.clientX - downX, minLeft),
        maxLeft
      )
      const moveY = Math.min(
        Math.max(offsetY + e.clientY - downY, minTop),
        maxTop
      )

      transform = {
        offsetX: moveX,
        offsetY: moveY,
      }
      targetRef.style.transform = `translate(${addUnit(
        moveX
      )}, ${addUnit(moveY)})`
    }

    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
    }

    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }

  const onDraggable = () => {
    targetRef = document.querySelector(className)
    if (dragRef.value && targetRef) {
      dragRef.value.onmouseover = () => (dragRef.value.style.cursor = `move`)
      dragRef.value.addEventListener('mousedown', onMousedown)
    }
  }

  const offDraggable = () => {
    if (dragRef.value && targetRef) {
      dragRef.value.removeEventListener('mousedown', onMousedown)
    }
  }

  onMounted(() => {
    watchEffect(() => {
      if (draggable.value) {
        onDraggable()
      } else {
        offDraggable()
      }
    })
  })

  onBeforeUnmount(() => {
    offDraggable()
  })
}
