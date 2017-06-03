const fs = require("fs")
const path = require("path")

const copy = (src, to, callback) => {
    fs.readdir(src, (err, paths) => {
        if (err) throw err

        const copyIsOver = copyOver(paths.length)

        paths.forEach(item => {
            const _src = src + '\\' + item
            const _dist = to + "\\" + item

            fs.stat(_src, (err, st) => {
                if(err) throw err

                if(st.isFile()) {
                    const readable = fs.createReadStream(_src)
                    const writable = fs.createWriteStream(_dist)

                    readable.pipe(writable)
                } else if(st.isDirectory()) {
                    dir(_src, _dist)
                }

                if(copyIsOver() && callback)
                    callback()
            })
        })
    })
}

const dir = (src, to) => {
    fs.exists(to, (err, exists) => {
        if(err) throw err

        if(exists)  copy(src, to)
        else        fs.mkdir(to, (err, data) => {copy(src, to)})
    })
}

const copyOver = times => {
    let count = 0
    
    return () => {
        if(++count === times)
            return true
        else
            return false
    }
}

module.exports = copy