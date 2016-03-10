'use strict'

const ipfs = require('./../index.js').ipfs
const bs58 = require('bs58')
const debug = require('debug')
const log = debug('http-api:object')
log.error = debug('http-api:object:error')

exports = module.exports

exports.new = {
  // pre request handler that parses the args and returns `template` which is assigned to `request.pre.args`
  parseArgs: (request, reply) => {
    // TODO improve this validation once ipfs.object.new supports templates
    if (request.query.arg === '') {
      return reply({
        Message: `template \'${request.query.arg}\' not found`,
        Code: 0
      }).code(500).takeover()
    }

    return reply({
      template: request.query.arg
    })
  },

  // main route handler which is called after the above `parseArgs`, but only if the args were valid
  handler: (request, reply) => {
    const template = request.pre.args.template

    ipfs.object.new(template, (err, obj) => {
      if (err) {
        log.error(err)
        return reply({
          Message: 'Failed to create object: ' + err,
          Code: 0
        }).code(500)
      }

      return reply({
        Hash: bs58.encode(obj.Hash).toString(),
        Links: obj.Links || null
      })
    })
  }
}

exports.get = {
  // pre request handler that parses the args and returns `key` which is assigned to `request.pre.args`
  parseArgs: (request, reply) => {
    if (!request.query.arg) {
      return reply("Argument 'key' is required").code(400).takeover()
    }

    try {
      return reply({
        key: new Buffer(bs58.decode(request.query.arg))
      })
    } catch (err) {
      log.error(err)
      return reply({
        Message: 'invalid ipfs ref path',
        Code: 0
      }).code(500).takeover()
    }
  },

  // main route handler which is called after the above `parseArgs`, but only if the args were valid
  handler: (request, reply) => {
    const key = request.pre.args.key

    ipfs.object.get(key, (err, obj) => {
      if (err) {
        log.error(err)
        return reply({
          Message: 'Failed to get object: ' + err,
          Code: 0
        }).code(500)
      }

      return reply({
        Links: obj.links.map((link) => ({
          Name: link.name,
          Hash: bs58.encode(link.hash).toString(),
          Size: link.size
        })),
        Data: obj.data.toString()
      })
    })
  }
}
