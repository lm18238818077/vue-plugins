import axios from 'axios'
import { ElMessage } from 'element-plus'


let flagToken = false // token失效的多次弹窗的开关

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = (msg, code) => {
  if (flagToken && code === 4) return
  ElMessage({
    message: msg,
    type: 'error',
    duration: 3 * 1000
  })
}

const contentType = {
  SHEET: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  STREAMstream: 'application/octet-stream',
  ZIP: 'application/zip'
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    case 403:
    case 5:
      break
    case 401:
    case 4:
      tip('登录过期，请重新登录', 4)
      flagToken = true
      break
    // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    default:
      tip(other)
  }
}

const service = axios.create({
  baseURL: '/'
})

const blobToJson = (blobData) => {
  return new Promise((resolve, reject) => {
    let fileType = blobData.type
    if (fileType && fileType.startsWith('application/json')) {
      let reader = new FileReader()
      reader.addEventListener('loadend', function () {
        let data = JSON.parse(reader.result)
        Object.assign(blobData, data)
        resolve(blobData)
      })
      reader.readAsText(blobData, 'UTF-8') // 加UTF-8防止中文乱码
    } else {
      resolve(blobData)
    }
  })
}

service.interceptors.request.use(
  (config) => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  async response => {
    // 检查并存储授权信息
    if (response.status === 200 && Object.values(contentType).includes(response.headers['content-type'])) {
      const content = response.headers['content-disposition']
      let name1 = content.match(/filename=(.*);/)[1]
      let name2 = content.match(/filename\*=(.*)/)[1]
      name1 = decodeURIComponent(name1)
      name2 = decodeURIComponent(name2.substring(5).replace(/'/g, ''))
      const filewrap = {
        data: {
          data: {
            file: new Blob([response.data]),
            name: name2 || name1
          }
        }
      }
      return Promise.resolve(filewrap)
    } else if (response.status >= 200 && response.status < 300 && response.data?.Statu === 1) {
      flagToken = false
      return Promise.resolve(response)
    } else {
      await blobToJson(response.data)
      const { noTip } = response.config
      if (!noTip) {
        errorHandle(response.data?.Statu, response.data?.Msg)
      }
      return Promise.resolve(response)
    }
  },
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.Msg || '服务器错误')
      return Promise.reject(response)
    } else {
      return Promise.reject(error)
    }
  }
)

export default (config) => {
  return service(config).then(response => {
    return response.data
  })
}
