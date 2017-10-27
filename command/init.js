const path = require('path')
const inquirer = require('inquirer')
const copy = require('./../tools/copy')

require('../tools/colors')()

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
        console.log('\ninitialize complete!\n'.success)
        console.log('please run:', `\n   cd ${name}\n   npm install && sl dev`.info)
      }

    case 'iGroot Business Component':
      return () => {
        console.log('\ninitialize complete!\n'.success)
        console.log('if you need to develop and debugging the iGroot business component, please run:'.info)
        console.log(`\n   cd ${name}\n   npm install && sl dev`.info)
      }
  }
}