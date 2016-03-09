'use strict'

const Command = require('ronin').Command
const IPFS = require('../../../ipfs-core')
const bs58 = require('bs58')
const debug = require('debug')
const log = debug('cli:object')
log.error = debug('cli:object:error')

module.exports = Command.extend({
  desc: 'Create new ipfs objects',

  options: {},

  run: (template) => {
    var node = new IPFS()

    node.object.new(template, (err, obj) => {
      if (err) {
        log.error(err)
        throw err
      }

      console.log(bs58.encode(obj.Hash).toString())
    })
  }
})
