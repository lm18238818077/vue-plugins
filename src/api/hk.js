import request from '@/utils/request'
import { secret, secretW } from '@/config/hk/index'
import { HkSignature, noAccessToken } from '@/utils/utils'
export const hkpath = (key, url) => {
  return `POST\n*/*\napplication/json; charset=utf-8\nx-ca-key:${key}\n${url}`
}
// 获取海康预览url
export const hkpreviewURLs = ({ token, data, baseUrl }) => {
  let hkurl = '/artemis/api/video/v1/cameras/previewURLs'
  let path = hkpath(secret.APPkey, hkurl)
  let Signature = HkSignature(path, secret.APPsecret)
  return request({
    url: baseUrl,
    headers: {
      Accept: ' */*',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Ca-Key': secret.APPkey,
      'X-Ca-Signature': Signature,
      'X-Ca-Signature-Headers': 'x-ca-key',
      Authorization: token,
      ...noAccessToken()
    },
    method: 'post',
    data
  })
}

export const hkplaybackURLs = (data) => {
  let url = '/artemis/api/video/v1/cameras/playbackURLs'
  let path = hkpath(secret.APPkey, url)
  let Signature = HkSignature(path, secret.APPsecret)
  return request({
    url: '/api/sys/HikService/playbackURLs',
    headers: {
      Accept: ' */*',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Ca-Key': secret.APPkey,
      'X-Ca-Signature': Signature,
      'X-Ca-Signature-Headers': 'x-ca-key',
      ...noAccessToken()
    },
    method: 'post',
    data
  })
}

export const hktalkURLs = (data) => {
  let url = '/artemis/api/video/v1/cameras/talkURLs'
  let path = hkpath(secret.APPkey, url)
  let Signature = HkSignature(path, secret.APPsecret)
  return request({
    url: '/api/sys/HikService/talkURLs',
    headers: {
      Accept: ' */*',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Ca-Key': secret.APPkey,
      'X-Ca-Signature': Signature,
      'X-Ca-Signature-Headers': 'x-ca-key',
      ...noAccessToken()
    },
    method: 'post',
    data
  })
}

// 获取第二个海康预览url
export const wHkpreviewURLs = (data) => {
  let url = '/artemis/api/video/v1/cameras/previewURLs'
  let path = hkpath(secretW.APPkey, url)
  let Signature = HkSignature(path, secretW.APPsecret)
  return request({
    url: '/api/sys/HikService/raw/previewURLs',
    headers: {
      Accept: ' */*',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Ca-Key': secretW.APPkey,
      'X-Ca-Signature': Signature,
      'X-Ca-Signature-Headers': 'x-ca-key',
      ...noAccessToken()
    },
    method: 'post',
    data
  })
}
