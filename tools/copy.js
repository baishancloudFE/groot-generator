const fs = require("fs")
const path = require("path")
const dir = require("./dir")

// 这是替换符 (@'v'@)
const REPLACE_SYMBOL = "__\\(@'v'@\\)__"

const isHtml = /.*\.html$/
const isPage = /.*src(\\|\\\\|\/)pages(\\|\\\\|\/).+/
const matchDirName = /.*(\\|\\\\|\/)(.*)$/
const ReplaceReg = new RegExp(REPLACE_SYMBOL, "g")

const copy = (src, to, callback) => {
  src = path.resolve(__dirname, src)
  to = dir(to)

  fs.readdir(src, (err, paths) => {
    if (err) throw err

    const copyIsOver = copyOver(paths.length)

    paths.forEach(item => {
      const _src = path.join(src, item)
      const _dist = path.join(to, item)

      fs.stat(_src, (err, st) => {
        if (err) throw err

        if (st.isFile()) {
          // const readable = fs.createReadStream(_src)
          const writable = fs.createWriteStream(_dist)

          new Promise((reslove, reject) => {
            if (isHtml.test(_src) && isPage.test(to)) {
              const dirName = matchDirName.exec(to)[2]

              fs.readFile(_src, 'utf-8', (err, data) => {
                if (err) throw err

                reslove(Buffer.from(data.replace(ReplaceReg, dirName)))
              })
            } else
              fs.readFile(_src, (err, data) => {
                if (err) reject(err)
                else reslove(data)
              })
          }).then(fileBuffer => writable.end(fileBuffer))
        } else if (st.isDirectory())
          copyDir(_src, _dist)

        if (copyIsOver() && callback)
          callback()
      })
    })
  })
}

const copyDir = (src, to) => {
  fs.exists(to, (err, exists) => {
    if (err) throw err

    if (exists) copy(src, to)
    else fs.mkdir(to, (err, data) => { copy(src, to) })
  })
}

const copyOver = times => {
  let count = 0

  return () => {
    if (++count === times)
      return true
    else
      return false
  }
}

module.exports = copy
