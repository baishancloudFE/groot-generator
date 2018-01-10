const path = require('path')
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

    return copy(`../template/${type.toLowerCase().replace(/\s/g, '-')}`, name, initCallback(answers))
  })
}

function initCallback({name, type}) {
  switch(type) {
    case 'iGroot Project':
      return () => {
        console.log(chalk.green('\ninitialize complete!\n'))
        console.log('please run:', chalk.blue(`\n   cd ${name}\n   npm install\n   sl dev`))
      }

    case 'iGroot Business Component':
      return () => {
        console.log(chalk.green('\ninitialize complete!\n'))
        console.log(chalk.blue('if you need to develop and debugging the iGroot business component, please run:'))
        console.log(chalk.blue(`\n   cd ${name}\n   npm install\n   sl dev`))
      }
  }
}