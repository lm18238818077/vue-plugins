import { isNumber, isString } from 'lodash'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Base64 from 'crypto-js/enc-base64'

export const download = (url) => {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
}

export function addUnit(value, defaultUnit = 'px') {
  if (!value) return ''
  if (isString(value)) {
    return value
  } else if (isNumber(value)) {
    return `${value}${defaultUnit}`
  }
}

export const HkSignature = (path, appSecret) => {
  // `POST\n*/*\napplication/json\nx-ca-key:${key}\n${url}`
  return Base64.stringify(hmacSHA256(path, appSecret))
}

export function noAccessToken () {
  const userId = ''
  const timespan = Date.now()
  const Comp = 'SXSH'
  const all = Comp.toLowerCase() + userId + timespan
  return {
    token: btoa(btoa(btoa(all))),
    timespan,
    userId,
    Comp
  }
}