const fs = require('fs')
const npm = require('npm')
const ora = require('ora')
const path = require('path')
const Git = require('nodegit')
const chalk = require('chalk')
const inquirer = require('inquirer')
const copy = require('./../tools/copy')

module.exports = function() {
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

    if (type === 'iGroot Project') {
      const spinner = ora(`Cloning into '${chalk.blue(name)}' from '${chalk.blue('https://github.com/baishancloudFE/igroot-template-sider')}'...`)

      spinner.start()
      return Git.Clone('https://github.com/baishancloudFE/igroot-template-sider', path.join(process.cwd(), name))
        .then(repository => new Promise((resolve, reject) => {
          const appPath = path.join(process.cwd(), name)
          const dependencies = Object.keys(require(appPath + '/package.json').dependencies)

          spinner.stop()
          resolve({
            name,
            path: appPath,
            modules: dependencies
          })
        }).then(install))
    }

    return copy(`../template/${type.toLowerCase().replace(/\s/g, '-')}`, name, initCallback(answers))
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
  }
}

function install({name, path, modules}) {
  process.chdir(path)
  npm.load({registry: 'https://registry.npm.taobao.org'}, function (err) {
    if (err) return console.error(chalk.red('\n\nFailed to load npm, please manually install the dependencies T^T...\n'))

    console.log('\n\nInstalling packages. This might take a couple of minutes.')

    npm.install(path, ...modules, function (err) {
      if (err) return console.error(chalk.red('\n\nFailed to install dependencies T^T...\n'))

      console.log(chalk.green('\nDone.\n'))
      console.log('please run:', chalk.blue(`\n   cd ${name} & sl dev`))
    })
  })
}