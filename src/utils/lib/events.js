export default (function () {
  let clienlist = {}
  let addlisten; let trigger; let remove
  /**
   * 增加订阅者
   * @key {String} 类型
   * @fn {Function} 回掉函数
   * */
  addlisten = function (key, fn) {
    if (!clienlist[key]) {
      clienlist[key] = []
    }
    clienlist[key].push(fn)
  }
  /**
   * 发布消息
   * */
  trigger = function () {
    let key = [].shift.call(arguments)
    let fns = clienlist[key] // 取出该类型的对应的消息集合
    if (!fns || fns.length === 0) {
      return false
    }
    // eslint-disable-next-line no-cond-assign
    for (let i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments)
    }
  }
  /**
   * 删除订阅
   * @key {String} 类型
   * @fn {Function} 回掉函数
   * */
  remove = function (key, fn) {
    let fns = clienlist[key]// 取出该类型的对应的消息集合
    if (!fns) { // 如果对应的key没有订阅直接返回
      return false
    }
    if (!fn) { // 如果没有传入具体的回掉，则表示需要取消所有订阅
      fns && (fns.length = 0)
    } else {
      for (let l = fns.length - 1; l >= 0; l--) { // 遍历回掉函数列表
        if (fn === fns[l]) {
          fns.splice(l, 1)// 删除订阅者的回掉
        }
      }
    }
  }
  return {
    addlisten,
    trigger,
    remove
  }
})()
