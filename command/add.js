const path = require("path")
const copy = require('./../tools/copy')
const dir = require('./../tools/dir')

module.exports = function (page, component) {
    if(typeof page === 'string') {
        const pagePath = path.resolve(`./src/pages/${page}`)

        copy(path.resolve(__dirname, "../page/"), dir(pagePath), function() {
            console.log('\nPage templates to complete!')
            console.log(`Generate the path as follows: ${pagePath}`)
        })
    }

    if(typeof component === 'string') {
        const componentPath = path.resolve(`./src/components/${component}`)

        copy(path.resolve(__dirname, "../component/"), dir(componentPath), function() {
            console.log('\nComponent templates to complete!')
            console.log(`Generate the path as follows: ${componentPath}`)
        })
    }
}
