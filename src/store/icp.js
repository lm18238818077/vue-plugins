import { defineStore } from 'pinia'

export const useIcpStore = defineStore({
  id: 'icp',
  state: () => ({
    onCallConnect: [

    ],
  }),
  actions: {
    hasHkCode (data, type = 'hkvideo') {
      return this.onCallConnect.filter((v1) => v1.calltype === type).findIndex((v) => v.deviceCode === data.deviceCode) > -1
    },
    addCall (data) {
      // calltype hkvideo hkreplay hktalk
      this.onCallConnect.push(data)
    },
    reduceCall (val) {
      let index = this.onCallConnect.findIndex(v => v.cid === val.cid)
      if (index < 0) return
      this.onCallConnect.splice(index, 1)
    }
  },
  getters: {
    hkCallConnect (state) {
      return state.onCallConnect.filter(v => v.type === 'hk')
    }
  }
})
