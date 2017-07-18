import { httpRequest } from './http_request'
import { notification } from 'igroot'

// 默认头部信息
const defaultHeaders = {
  'version': '0.0.1',
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=utf-8'
}

// error 弹出锁, 避免弹出框过多
let errorLock = false

const warp = method => (data, showSuccessMsg = true) => {
  httpRequest[method](this.url, data, {}, {}, showSuccessMsg)
    .then(parseResponse)
    .then(res => {
      const [,,,,showSuccessMsg] = args

      if (res.code !== 200) {
        // 弹出提示框
        if (!errorLock) {
          errorLock = true
          setTimeout(() => errorLock = false, 2000)

          notification.error({
            message: `请求失败 code: ${res.code}`,
            description: res.msg ? res.msg : res.message || ''
          })
        }
      } else
        showSuccessMsg && notification.success({
          message: '请求成功',
          description: res.msg ? res.msg : ''
        })

      return res
    })

    .catch(err => {
      notification.error({
        message: '请求失败',
        description: '报错信息请打开控制台查看'
      })

      throw err
    })
}

/**
 * 响应体解析
 * @param {Response} response
 */
const parseResponse = response => {
  return response.clone().text()
    .then(text => new Promise((resolve, reject) => {
      if (text === '' || text === undefined)
        resolve({})
      else
        resolve(response.json())
    }))
}

export class ApiBase {
  constructor(configs) {
    const confType = typeof configs

    if (confType === 'object')
      this.url = APP_CONFIG[configs.group].apiDomain + configs.url

    else if (confType === 'string')
      this.url = APP_CONFIG.default.apiDomain + configs

    else
      throw new TypeError('API object constructor argument must be the object or string')
  }

  //按条件返回对象数组
  get(data, headers = {}, fetchObj = {}) {
    return httpRequest.get(this.url, data, headers, fetchObj)
      .then(parseResponse)
      .then(res => {
        if (res.code !== 200)
          notification.error({
            message: `请求失败 code: ${res.code}`,
            description: res.msg ? res.msg : res.message || ''
          })

        return res
      })
  }

  post = warp('post')
  put = warp('put')
  delete = warp('delete')
}
