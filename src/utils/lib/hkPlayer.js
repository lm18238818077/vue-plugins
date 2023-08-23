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
    this.mode = 0
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
      iMaxSplit: 4,
      iCurrentSplit: 2,
      openDebug: true,
      oStyle: {
        borderSelect: '#FFCC00'
      },
      ...options
    })
    this.player.JS_SetWindowControlCallback({
      windowEventSelect: function (iWndIndex) { // 插件选中窗口回调
        Events.trigger('windowEventSelect', iWndIndex)
      },
      pluginErrorHandler: function (iWndIndex, iErrorCode, oError) { // 插件错误回调
        Events.trigger('pluginErrorHandler', iWndIndex, iErrorCode, oError)
      },
      windowEventOver: function (iWndIndex) { // 鼠标移过回调
        Events.trigger('windowEventOver', iWndIndex)
      },
      windowEventOut: function (iWndIndex) { // 鼠标移出回调
        Events.trigger('windowEventOut', iWndIndex)
      },
      windowEventUp: function (iWndIndex) { // 鼠标mouseup事件回调
        Events.trigger('windowEventUp', iWndIndex)
      },
      windowFullCcreenChange: function (bFull) { // 全屏切换回调
        Events.trigger('windowFullCcreenChange', bFull)
      },
      firstFrameDisplay: function (iWndIndex, iWidth, iHeight) { // 首帧显示回调
        Events.trigger('firstFrameDisplay', iWndIndex, iWidth, iHeight)
      },
      performanceLack: function () { // 性能不足回调
        Events.trigger('performanceLack')
      }
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

  talkStart (u) {
    let url = u ?? this.urls.talk
    this.player.JS_StartTalk(url).then(
      () => { console.log('talkStart success') },
      (e) => { console.error(e) }
    )
  }

  talkStop () {
    this.player.JS_StopTalk().then(
      () => { console.log('talkStop success') },
      (e) => { console.error(e) }
    )
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

    player.JS_Play(playURL, { playURL, mode }, index, startTime, endTime).then(
      () => {
        console.log('playbackStart success')
        this.rate = 1
      },
      (e) => { console.error(e) }
    )
  }

  playbackPause (i) {
    return this.player.JS_Pause(i)
  }

  playbackStop () {
    this.player.JS_Stop().then(
      () => { console.log('playbackStop success') },
      (e) => { console.error(e) }
    )
  }

  playbackResume () {
    this.player.JS_Resume().then(
      () => { console.log('playbackResume success') },
      (e) => { console.error(e) }
    )
  }

  seekTo (playback) {
    let { seekStart, endTime } = playback
    seekStart += 'Z'
    endTime += 'Z'
    this.player.JS_Seek(this.player.currentWindowIndex, seekStart, endTime).then(
      () => { console.log('seekTo success') },
      (e) => { console.error(e) }
    )
  }

  playbackSlow () {
    this.player.JS_Slow().then(
      (rate) => {
        this.rate = rate
      },
      (e) => { console.error(e) }
    )
  }

  playbackFast () {
    this.player.JS_Fast().then(
      (rate) => {
        this.rate = rate
      },
      (e) => { console.error(e) }
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
    this.player.JS_SetVolume(index, value).then(
      () => {
        console.log('setVolume success', value)
      },
      (e) => { console.error(e) }
    )
  }

  capture (imageType) {
    let player = this.player
    let index = player.currentWindowIndex

    player.JS_CapturePicture(index, 'img', imageType).then(
      () => { console.log('capture success', imageType) },
      (e) => { console.error(e) }
    )
  }

  recordStart (type, fileNameDefault) {
    const codeMap = { MP4: 5, PS: 2 }
    let player = this.player
    let index = player.currentWindowIndex
    let fileName = fileNameDefault || `${Date.now()}.mp4`
    let typeCode = codeMap[type]

    player.JS_StartSaveEx(index, fileName, typeCode).then(
      () => { console.log('record start ...') },
      (e) => { console.error(e) }
    )
  }

  recordStop () {
    let player = this.player
    let index = player.currentWindowIndex

    player.JS_StopSave(index).then(
      () => { console.log('record stoped, saving ...') },
      (e) => { console.error(e) }
    )
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
      return videoInfo
    })
  }

  getOSDTime () {
    let player = this.player
    let index = player.currentWindowIndex

    player.JS_GetOSDTime(index).then(function (time) {
      return time
    })
  }

  resize (obj) {
    return this.player.JS_Resize(obj)
  }
}

export default HkPlayer
