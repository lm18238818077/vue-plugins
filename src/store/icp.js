const state = () => ({
  cloudICP: null,
  isdn: null,
  onCallConnect: [
    // { cid: 34, calltype: 'video' },
    // { cid: 33, calltype: 'monitor' },
  ],
  peopleState: [],
  dynamicGroup: []
})

// getters
const getters = {
  peopleStateTrans(state){
    let obj = {}
    state.peopleState.forEach(v=>obj[v.HuaWeiId] = v.OnlineStatus)
    return obj
  }
}

// actions
const mutations = {
  init(state, payload) {
    state.cloudICP = payload
  },
  isdn(state, payload) {
    state.isdn = payload
  },
  addCall(state, payload){
    state.onCallConnect.push(payload)
  },
  reduceCall(state, payload){
    let index = state.onCallConnect.findIndex(v=>v.cid == payload.cid)
    if(index < 0) return
    state.onCallConnect.splice(index, 1)
  },
  setPeopleState(state, payload){
    state.peopleState = payload
  },
  setDynamicGroup(state, payload){
    state.dynamicGroup = payload
  }
}


export default {
  state,
  getters,
  mutations
}