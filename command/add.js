const fs = require('fs')
const npm = require('npm')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const copy = require('./../tools/copy')

module.exports = (page, component) => {
  if (typeof page === 'string') {
    const pagePath = path.resolve(`./src/pages/${page}`)

    copy("../page/", pagePath, () => {
      console.log(chalk.green('\nPage templates to complete!'))
      console.log('Generate the path as follows: ' + chalk.blue(pagePath))
    })
  }

  if (component) {
    if(typeof component === 'string')
      return install(component)

    const question = [{
      type: 'list',
      name: 'component',
      message: 'Please choose you need business component:',
      choices: ['igroot-form-modal', 'other']
    }]

    const otherQuestion = [{
      type: 'input',
      name: 'component',
      message: 'Please enter your components to install:',
      validate: function (value) {
        if (value.trim().length !== 0)
          return true

        return 'Please enter your project name.'
      },

      filter: function (value) {
        return value.trim()
      }
    }]

    inquirer.prompt(question).then(answer => {
      if (answer.component === 'other')
        return inquirer.prompt(otherQuestion).then(answer => install(answer.component))

      install(answer.component)
    })
  }
}

function install(component) {
  npm.load({
    save: true,
    registry: 'https://registry.npm.taobao.org'
  }, function(err) {
    if(err) return console.error(chalk.red('\n\nFailed to load npm T^T...\n'))

    npm.install(process.cwd(), component, function(err) {
      if (err) return console.error(chalk.red(`\n\nFailed to install component '${component}' T^T...\n`))

      const target = path.join(process.cwd(), 'bsy.json')

      fs.readFile(target, function (err, data) {
        if (err) console.error(chalk.red(`\n\ncomponent \'${component}\' has been installed, but \'bsy.json\' has been read/write error, please manually add the component information to the \'businessComponents\' object\n`))

        const bsy = JSON.parse(data)
        bsy.options.businessComponents = bsy.options.businessComponents || []

        if (bsy.options.businessComponents.indexOf(component) === -1)
          bsy.options.businessComponents.push(component)

        fs.writeFile(target, JSON.stringify(bsy, undefined, 2), function(err) {
          if (err) console.error(chalk.red(`\n\ncomponent \'${component}\' has been installed, but \'bsy.json\' has been read/write error, please manually add the component information to the \'businessComponents\' object\n`))
          console.log(chalk.blue(`\n\n'${component}' has been installed.\n`))
        })
      })
    })
  })
}