import { isNumber, isString } from 'lodash'

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