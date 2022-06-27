import { createStore, createLogger } from 'vuex'
import icp from './icp.js'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    icp
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})