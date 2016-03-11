'use strict'

const Command = require('ronin').Command
const IPFS = require('../../../ipfs-core')
const bs58 = require('bs58')
const debug = require('debug')
const log = debug('cli:object')
log.error = debug('cli:object:error')

module.exports = Command.extend({
  desc: 'Get stats for the DAG node named by <key>',

  options: {},

  run: (key) => {
    var node = new IPFS()

    if (!key) {
      throw new Error("Argument 'key' is required")
    }

    const mh = new Buffer(bs58.decode(key))
    node.object.stat(mh, (err, stats) => {
      if (err) {
        log.error(err)
        throw err
      }

      Object.keys(stats).forEach((key) => {
        console.log(`${key}: ${stats[key]}`)
      })
    })
  }
})
