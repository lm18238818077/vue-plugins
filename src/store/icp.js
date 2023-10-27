
import { computed, ref } from 'vue'


export function useIcpStore() {
  // 局部状态，每个组件都会创建
  const onCallConnect = ref([])

  const addCall = (data) => {
    let index = onCallConnect.value.findIndex(v => v.cid === data.cid)
    if (index < 0) {
      onCallConnect.value.push(data)
    }
  }
  const reduceCall = (val) => {
    let index = onCallConnect.value.findIndex(v => v.cid === val.cid)
    if (index < 0) return
    onCallConnect.value.splice(index, 1)
  }

  const hkCallConnect = computed(() => {
    return onCallConnect.value.filter(v => v.type === 'hk')
  })

  return {
    onCallConnect,
    addCall,
    reduceCall,
    hkCallConnect
  }
}
