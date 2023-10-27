import Events from './events'
const HkConstructor = require('./hk/h5player.min.js')

/**
 * description
 *  自定义触发事件名称
 *  1、JS_ArrangeWindow
 */
class HkPlayer {

  constructor (options, urls) {
    this.options = options
    this.muted = true
    this.volume = 50
    this.mseSupport = !!window.MediaSource
    this.mode = 1
    this.rate = 0
    this.urls = {
      realplay: '',
      talk: '',
      playback: '',
      ...urls
    }
    this.player = new HkConstructor.JSPlugin({
      szId: 'hk_player',
      szBasePath: '/hk',
      iMaxSplit: 1,
      iCurrentSplit: 1,
      openDebug: true,
      oStyle: {
        borderSelect: '#FFCC00'
      },
      ...options
    })
  }

  addlisten (name, fn) {
    Events.addlisten(name, fn)
  }

  changeUrls (obj) {
    Object.assign(this.urls, obj)
  }

  arrangeWindow (splitNum) {
    return this.player.JS_ArrangeWindow(splitNum).then(
      () => {
        return 'success'
      },
      (e) => { console.error(e) }
    )
  }
  /**
   * description 整体全屏
  */

  wholeFullScreen (type = true) {
    return this.player.JS_FullScreenDisplay(type)
  }

  singleFullScreenSingle (i = 0) {
    return this.player.JS_FullScreenSingle(i)
  }

  /* 预览&对讲 */
  realplay (u, i) {
    let { player, mode, urls } = this
    let index = i ?? player.currentWindowIndex
    let playURL = u ?? urls.realplay

    return player.JS_Play(playURL, { playURL, mode }, index)
  }

  stopPlay (i = 0) {
    return this.player.JS_Stop(i).then(
      () => {
        this.rate = 0
        return 'success'
      },
      (e) => { console.error(e) }
    )
  }

  talkStart(u) {
    this.player.JS_SetConnectTimeOut(0, 1000)
    let url = u ?? this.urls.talk
    return this.player.JS_StartTalk(url)
  }

  talkStop () {
    return this.player.JS_StopTalk()
  }

  stopAllPlay () {
    this.player.JS_StopRealPlayAll().then(
      () => { this.rate = 0; console.log('stopAllPlay success') },
      (e) => { console.error(e) }
    )
  }

  /* 回放 */
  playbackStart (playback) {
    let { player, mode, urls } = this
    let index = player.currentWindowIndex
    let playURL = urls.playback
    let { startTime, endTime } = playback

    startTime += 'Z'
    endTime += 'Z'
    this.rate = 1
    return player.JS_Play(playURL, { playURL, mode }, index, startTime, endTime)
  }

  playbackPause() {
    let index = this.player.currentWindowIndex
    return this.player.JS_Pause(index)
  }

  playbackStop () {
    return this.player.JS_Stop()
  }

  playbackResume() {
    let index = this.player.currentWindowIndex
    return this.player.JS_Resume(index)
  }

  playbackSeekTo (playback) {
    let { startTime, endTime } = playback
    startTime += 'Z'
    endTime += 'Z'
    return this.player.JS_Seek(this.player.currentWindowIndex, startTime, endTime)
  }

  playbackSlow () {
    return this.player.JS_Slow().then(
      (rate) => {
        this.rate = rate
        return rate
      },
      (e) => { return e }
    )
  }

  playbackFast () {
    return this.player.JS_Fast().then(
      (rate) => {
        this.rate = rate
        return rate
      },
      (e) => { return e }
    )
  }

  frameForward () {
    this.player.JS_FrameForward(this.player.currentWindowIndex).then(
      () => { this.rate = 1; console.log('frameForward success') },
      (e) => { console.error(e) }
    )
  }

  /* 声音、抓图、录像 */
  openSound () {
    return this.player.JS_OpenSound().then(
      () => {
        this.muted = false
        return 'success'
      },
      (e) => { console.error(e) }
    )
  }

  closeSound () {
    return this.player.JS_CloseSound().then(
      () => {
        this.muted = true
        return 'success'
      },
      (e) => { console.error(e) }
    )
  }

  setVolume (value) {
    let player = this.player
    let index = player.currentWindowIndex
    return this.player.JS_SetVolume(index, value)
  }

  capture (fileName, imageType, cb) {
    let player = this.player
    let index = player.currentWindowIndex

    return player.JS_CapturePicture(index, fileName, imageType, cb)
  }

  recordStart (type, fileNameDefault) {
    const codeMap = { MP4: 5, PS: 2 }
    let player = this.player
    let index = player.currentWindowIndex
    let fileName = fileNameDefault || `${Date.now()}.mp4`
    let typeCode = codeMap[type]
    return player.JS_StartSaveEx(index, fileName, typeCode)
  }

  recordStop () {
    let player = this.player
    let index = player.currentWindowIndex
    return player.JS_StopSave(index)
  }

  /* 电子放大、智能信息 */
  enlarge () {
    let player = this.player
    let index = player.currentWindowIndex

    player.JS_EnableZoom(index).then(
      () => { console.log('enlarge start..., select range...') },
      (e) => { console.error(e) }
    )
  }

  enlargeClose () {
    let player = this.player
    let index = player.currentWindowIndex

    player.JS_DisableZoom(index).then(
      () => { console.log('enlargeClose success') },
      (e) => { console.error(e) }
    )
  }

  /**
   * description 开启智能信息
   */
  intellectTrigger (openFlag) {
    let player = this.player
    let index = player.currentWindowIndex

    let result = player.JS_RenderALLPrivateData(index, openFlag)
    console.log(`${openFlag ? 'open' : 'close'} intellect ${result === 1 ? 'success' : 'failed'}`)
  }

  /**
   * description 获取视频信息
   */
  getvideoInfo () {
    let player = this.player
    let index = player.currentWindowIndex
    player.JS_GetVideoInfo(index).then(function (videoInfo) {
      console.log('videoInfo:', videoInfo)
      return videoInfo
    })
  }

  getOSDTime () {
    let player = this.player
    let index = player.currentWindowIndex

    player.JS_GetOSDTime(index).then(function (time) {
      console.log('osdTime:', new Date(time))
      return time
    })
  }

  resize (obj) {
    return this.player.JS_Resize(obj)
  }
}

export default HkPlayer
