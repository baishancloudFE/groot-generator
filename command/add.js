const path = require("path")
const copy = require('./../tools/copy')

require('../tools/colors')()

module.exports = page => {
  if (typeof page === 'string') {
    const pagePath = path.resolve(`./src/pages/${page}`)

    copy("../page/", pagePath, () => {
      console.log('\nPage templates to complete!'.success)
      console.log('Generate the path as follows: ' + pagePath.info)
    })
  }
}
