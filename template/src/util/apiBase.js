import {httpRequest} from './http_request'
import {notification} from 'igroot'

// 默认头部信息
const defaultHeaders = {
    'version': '0.0.1',
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8'
}

// error 弹出锁, 避免弹出框过多
let errorLock = false

const warp = method =>  (data, showSuccessMsg = true) => {
    httpRequest[method](this.baseUrl, data, {}, {}, showSuccessMsg)
        .then(parseResponse)
        .then(res => {
            if (res !== false) {
                const [,,,,showSuccessMsg] = args
                if (res.code !== 200)
                    notification.error({message: '校验失败', description: res.msg})
                else
                    showSuccessMsg && notification.success({message: '请求成功', description: res.msg ? res.msg : ''})

                return res
            } else if (res.code !== 200) {}
        })
        .catch(err => {
            notification.error({message: '请求失败', description: '报错信息请打开控制台查看'})
            throw err
        })
}

/**
 * 响应体解析
 * @param {Response} response
 */
const parseResponse = (response) => {
    // TODO: 逻辑还是不严谨，还需要判断非 json 字符串，以及加上状态码判断
    return response.clone().text()
        .then(text => new Promise((resolve, reject) => {
            if (text === '' || text === undefined)
                resolve({})
            else
                resolve(response.json())
        }))

        .then(json => {
            if (response.headers && response.headers.get('x-pagination-per-page') && json.datas) {
                return {
                    ...json,
                    current: response.headers.get('x-pagination-current-page'),
                    total: response.headers.get('x-pagination-total-count'),
                    pageSize: response.headers.get('x-pagination-per-page')
                }
            } else
                return json
        })

        .then(json => {
            //  todo: 这边要根据相应的接口协定逻辑进行处理
            //  todo: 修改then逻辑，如果接口异常，统一返回false,
            //        所以在数据处理层要做一个判断，判断不是false才执行相应逻辑
            const {status} = response

            if (status !== 200) {
                if (json.code !== 200) {
                    notification.error({
                        message: `返回结果失败 code:${json.code}`, description: json.msg ? json.msg : json.message || ''
                    })
                    return json
                } else {
                    notification.error({
                        message: `请求失败 status:${status}`,
                        description: ''
                    })
                    return false
                }
            } else {
                if (json.code !== 200) {
                    // 弹出提示框
                    if(!errorLock) {
                        errorLock = true
                        setTimeout(() => errorLock = false, 2000)

                        notification.error({
                            message: `校验失败 code: ${json.code}`, description: json.msg ? json.msg : json.message || ''
                        })
                    }

                    // 非 200 状态操作
                    if (json.code === 401) {
                        window.location.href = "/#/"
                        return false
                    }
                } else
                    showSuccessMsg && notification.success({message: '请求成功', description: json.msg ? json.msg : ''})

                if (json.code === 401) {
                    notification.error({
                        message: `登录校验失败 code:${json.code}`, description: json.msg ? json.msg : json.message || ''
                    })

                    window.location.href = "/#/"
                    return false
                }
            }

            return json
        })
}

/**
 * api架构上做为一个层，有如下考虑:
 *   - 路径、提交方式相关，做到尽量精简
 *   - 数据格式的转化，最好放在 service 层
 * 
 * 属性：
 *   baseUrl       基础路径
 *   uniqueField   唯一键值的属性名称
 *   apiKey        路由
 *   actionsMate   操作{api函数  =>  接口操作key }对照表
 */
export class ApiBase {
    constructor(configs) {
        const confType = typeof configs

        if (typeof confType === 'Object')
            this.baseUrl = APP_CONFIG[configs.group].apiDomain + configs.url

        else if (confType === 'string')
            this.baseUrl = APP_CONFIG.default.apiDomain + configs

        else
            throw new TypeError('API object constructor argument must be the object or string')
    }

    /**
     * 负责解析当前接口的所有操作权限
     * @param settingMate
     */
    // getPermissionByOps(opsList) {
    //     let actions = opsList[this.apiKey]
    //     if (!actions || !(actions instanceof Array) && actions.length == 0) {
    //         return {}
    //     }
    //     let _permissions = {}
    //     let _defaultMate = {
    //         query: 'index',
    //         queryToExcel: 'index',
    //         getOne: 'view',
    //         add: 'add',
    //         update: 'edit',
    //         delete: 'delete'
    //     }
    //     let _settingMate = Object.assign(_defaultMate, this.actionsMate)
    //     for (let prop in _settingMate) {
    //         let val = _settingMate[prop]
    //         if (actions.indexOf(val) >= 0) {
    //             _permissions[prop] = true
    //         }
    //     }
    //     return _permissions
    // }

    // 有些接口需要转成字符串，有些接口不需要转化（一般情况，是需要转化成字符串格式）
    madeQueryData(queryData = {}) {
        // 对象需要转化成数组
        if (!!queryData.search && typeof(queryData.search) !== "string") {
            queryData.search = JSON.stringify(queryData.search)
        }
        return queryData
    }

    // TODO: 不清楚具体的格式，有该方面需求后再实现
    getOne(id, data) {}

    //按条件返回对象数组
    get(data, headers = {}, fetchObj = {}) {
        data = this.madeQueryData(data)

        // X-Bs-Resource-Type  1:搜索 2:列表头 3:搜索+列表头 4:数据 5:搜索+数据 6:列表头+数据 7:搜索+列表头+数据
        headers['X-Bs-Resource-Type'] = '7'

        if (data['resourceType']) {
            if (data['resourceType'] === 7)
            // 请求类型为7时不需要向后台发送search条件，如果发送则接口不返回保存在服务端的搜索条件
                delete data['search']
            else
            // 除了 7 的情况，都不需要 tableConfKey
                headers['X-Bs-Resource-Type'] = data['resourceType']

            delete data['resourceType']
        }

        if (data['per_page']) {
            // 根据规范，需要特殊处理
            data['per-page'] = data['per_page']
            delete data['per_page']
        }

        return httpRequest.get(this.baseUrl, data, headers, fetchObj)
            .then(parseResponse)
    }

    post = warp('post')
    put = warp('put')
    delete = warp('delete')

    /**
     * 按条件下载相应的EXCEL文件
     * TODO: 需要获取平台 id
     * 
     * @param {Object} data 
     */
    downExcel(data) {
        // 如果数据交互需要调整数据，可以继承当前函数并改写
        data = this.madeQueryData(data)
        //     if (data) {
        //         if (data['resourceType'])
        //             delete data['resourceType']

        //         if (data['per_page']) {
        //             //根据规范，需要特殊处理
        //             data['per-page'] = data['per_page']
        //             delete data['per_page']
        //         }
        //     }

        //     data['excel'] = true

        //     // if (globalState.getPlatformId()) {
        //     //     data['platform-id'] = globalState.getPlatformId()
        //     // }

        //     const urlParameters = Object.keys(data).map(i => `${i}=${data[i]}`).join('&')
        //     // 增加隐藏窗口，下载相应文件
        //     // todo: 如果下载多了的话，会有多个 iframe
        //     const iframe = document.createElement('iframe')
        //     iframe.src = `${this.baseUrl}?${urlParameters}`
        //     iframe.style.display = 'none'
        //     document.body.appendChild(iframe)
    }
}