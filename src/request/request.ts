import axios from './index'
import qs from 'qs'

export class Request {
  static get = (url: string, params?: any) => {
    return new Promise<any>((resolve, reject) => {
      axios.get(url, { params: params }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static post = (url: string, params?: any) => {
    return new Promise<any>((resolve, reject) => {
      axios.post(url, qs.stringify(params)).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
