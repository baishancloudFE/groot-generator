import {extend} from './extends/'

export const apis = {
    test: '/static/test.json',
    test2: {
        group: 'test',
        url: '/static/test.json',
        extend: extend.test2
    }
}
