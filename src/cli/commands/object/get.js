'use strict'

const Command = require('ronin').Command
const IPFS = require('../../../ipfs-core')
const bs58 = require('bs58')
const debug = require('debug')
const log = debug('cli:object')
log.error = debug('cli:object:error')

module.exports = Command.extend({
  desc: 'Get and serialize the DAG node named by <key>',

  options: {},

  run: (key) => {
    var node = new IPFS()

    if (!key) {
      throw new Error("Argument 'key' is required")
    }

    const mh = new Buffer(bs58.decode(key))
    node.object.get(mh, (err, obj) => {
      if (err) {
        log.error(err)
        throw err
      }

      console.log(JSON.stringify({
        Links: obj.links,
        Data: obj.data.toString()
      }))
    })
  }
})
