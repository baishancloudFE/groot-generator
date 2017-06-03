const path = require("path")
const copy = require('./../tools/copy')
const dir = require('./../tools/dir')

module.exports = function (name) {
    copy(path.resolve(__dirname, "../template/"), dir(name), function() {
        console.log('\ninitialize complete!')
        console.log(`please run:\n\tcd ${name} && npm install`)
    })
}
