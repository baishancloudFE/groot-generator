const fs = require('fs')
const npm = require('npm')
const ora = require('ora')
const path = require('path')
const rm = require('rimraf')
const chalk = require('chalk')
const inquirer = require('inquirer')
const {exec} = require('child_process')
const copy = require('./../tools/copy')

const template = {
  'iGroot Project': 'https://github.com/baishancloudFE/igroot-template-sider.git',
  'iGroot Business Component': 'https://github.com/baishancloudFE/igroot-component-template.git',
}

module.exports = function(args, collect = () => {}) {
  collect({}, true)

  const questions = [{
    type: 'list',
    name: 'type',
    message: 'What project type do you need?',
    choices: ['iGroot Project', 'iGroot Business Component']
  }, {
    type: 'input',
    name: 'name',
    message: 'What\'s your project name?',
    validate: function (value) {
      if (value.trim().length !== 0)
        return true

      return 'Please enter your project name.'
    },

    filter: function (value) {
      return value.trim()
    }
  }]

  inquirer.prompt(questions).then(answers => {
    const {name, type} = answers

    const response = template[type]
    const spinner = ora(`Cloning into '${chalk.blue(name)}' from '${chalk.blue(response)}'...`)

    spinner.start()

    return exec(`git clone ${response} ${path.join(process.cwd(), name)}`, (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red('\ngit clone failed !\n'))
        throw err
      }

      const appPath = path.join(process.cwd(), name)
      const dependencies = Object.keys(require(appPath + '/package.json').dependencies)

      spinner.stop()
      install({
        name,
        path: appPath,
        modules: dependencies
      }, initCallback(answers))
    })

    // copy(`../template/${type.toLowerCase().replace(/\s/g, '-')}`, name, () => initCallback(answers))
  })
}

function initCallback({name, type}) {
  switch(type) {
    case 'iGroot Business Component':
      return () => {
        console.log(chalk.green('\nDone.\n'))
        console.log(chalk.blue('if you need to develop and debugging the iGroot business component, please run:'))
        console.log(chalk.blue(`\n   cd ${name}\n   npm install\n   sl dev`))
      }

    case 'iGroot Project' :
      return err => {
        if (err) throw err

        // install 函数执行时已将根目录变更，因此无需再加上 name
        const bsyPath = path.resolve('bsy.json')
        const packagePath = path.resolve('package.json')
        const gitFolder = path.resolve('.git')

        const bsy = require(bsyPath)
        const package = require(packagePath)

        // 修改 bsy.json 与 package.json 中的项目名
        bsy.name = name
        package.name = name
        fs.writeFile(bsyPath, JSON.stringify(bsy, null, 2), err => err && console.log(chalk.yellow(`Failed to change the name in 'bsy.json'! Please change it manually.`)))
        fs.writeFile(packagePath, JSON.stringify(package, null, 2), err => err && console.log(chalk.yellow(`Failed to change the name in 'package.json'! Please change it manually.`)))

        // 移除 .git 文件夹
        rm(gitFolder, err => err && console.log(chalk.yellow(`\nFailed to remove the '${gitFolder}' folder! Please remove it manually.\n`)))
      }
  }
}

function install({name, path, modules}, callback) {
  // TODO: 弃用 npm 包，改用 child_process.exec 调用
  process.chdir(path)
  npm.load({registry: 'https://registry.npm.taobao.org'}, function (err) {
    if (err) {
      console.error(chalk.red('\n\nFailed to load npm, please manually install the dependencies T^T...\n'))
      return callback(err)
    }

    console.log('\n\nInstalling packages. This might take a couple of minutes.')

    npm.install(path, ...modules, function (err) {
      if (err) {
        console.error(chalk.red('\n\nFailed to install dependencies T^T...\n'))
        return callback(err)
      }

      console.log(chalk.green('\nDone.\n'))
      console.log('please run:', chalk.blue(`\n   cd ${name} & sl dev`))

      callback()
    })
  })
}