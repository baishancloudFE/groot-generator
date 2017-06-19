import {ApiBase} from '@/util/apiBase'
import {extend} from '@/util/function'
import {apis} from './api'

const API = {}

Object.keys(apis).forEach(key => {
    const api = apis[key]

    API[key] = typeof api === 'object' && api.extend
        ? extend(api.extend)(new ApiBase(api))
        : new ApiBase(api)
})

export {API}
