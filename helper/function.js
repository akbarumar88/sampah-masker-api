import {createHash} from 'node:crypto'

export const empty = (val) => {
  return (
    val == "" || val == null || val == undefined || val == false || val == 0
  )
}

export function sha256(content) {  
  return createHash('sha256').update(content).digest('hex')
}