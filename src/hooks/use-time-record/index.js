import { ref } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export const useTime = () => {
  const recordTime = ref()
  let startTime = ref()
  let t = null
  const start = () => {
    startTime.value = dayjs()
    t = setInterval(() => {
      recordTime.value = dayjs.duration(dayjs().diff(startTime.value)).format('HH:mm:ss')
    }, 1000)
  }
  const end = () => {
    if (t) clearInterval(t)
    t = null
  }
  return { recordTime, start, end }
}
