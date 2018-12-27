#!/usr/bin/env node

process.on('SIGINT', () => process.exit(1))

const yParser = require('yargs-parser')

const dev = require('../command/dev')
const build = require('../command/build')
const lint = require('../command/lint')
const help = require('../command/help')

const script = process.argv[2]
const args = yParser(process.argv.slice(3))

switch(script) {
  case '-h':
  case 'help':
  default: return help()
}