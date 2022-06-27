export const monitorParam = {
  width: 352,
  height: 288,
}

export const monitorFmt = ["4K", "2K", "1080P", "720P", "D1", "CIF", "QCIF"]

export const user = Array.from({length: 23}, (v, i)=> 77747000 + i + '')

export const calltype = (val) => {
  let type = 'voice'
  switch(val){
    case 'voice':
    case 'discreenlisten':
    case 'halfdial':
    case 'ambience':
      type = 'voice'
    break;
    case 'video':
    case 'monitor':
    case 'dispatch':
      type = 'video'
    break;
    default :
      type = 'voice'
  }
  return type
}