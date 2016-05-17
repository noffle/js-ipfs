'use strict'

const bs58 = require('bs58')
const ndjson = require('ndjson')
const Readable = require('stream').Readable
const multipart = require('ipfs-multipart')
const debug = require('debug')
const log = debug('http-api:files')
log.error = debug('http-api:files:error')

exports = module.exports

// common pre request handler that parses the args and returns `key` which is assigned to `request.pre.args`
exports.parseKey = (request, reply) => {
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
}

exports.add = {
  // pre request handler that parses the args and returns `node` which is assigned to `request.pre.args`
  handler: (request, reply) => {
    if (!request.payload) {
      return reply('Array, Buffer, or String is required').code(400).takeover()
    }
    const parser = multipart.reqParser(request.payload)
    var file = false
    var filePair
    const resArr = []
    var serialize = ndjson.serialize()

    // hapi doesn't permit object streams
    // http://hapijs.com/api#replyerr-result
    serialize._readableState.objectMode = false

    var i = request.server.app.ipfs.files.add()
    var written = 0

    i.on('data', (file) => {
      serialize.write({
        Name: file.path,
        Hash: bs58.encode(file.multihash).toString()
      })
      written++
    })

    i.on('end', () => {
      if (written === 0 && file) {
        return reply({
          Message: 'Failed to add files',
          Code: 0
        }).code(500)
      } else {
        serialize.end()
        return reply(serialize)
          .header('x-chunked-output', '1')
          .header('content-type', 'application/json')
      }
    })

    parser.on('file', (fileName, fileStream) => {
      var rs = new Readable()
      var init = false
      rs._read = () => {
        if (init) {
          return
        }
        init = true
      }
      fileStream.on('data', (data) => {
        rs.push(data)
        file = true
      })
      fileStream.on('end', () => {
        rs.push(null)
        filePair = {
          path: fileName,
          stream: rs
        }
        i.write(filePair)
      })
    })

    parser.on('end', () => {
      if (!file) {
        return reply("File argument 'data' is required").code(400).takeover()
      }
      i.end()
    })
  }
}

exports.cat = {
  // uses common parseKey method that returns a `key`
  parseArgs: exports.parseKey,

  // main route handler which is called after the above `parseArgs`, but only if the args were valid
  handler: (request, reply) => {
    const key = request.pre.args.key

    request.server.app.ipfs.files.cat(key, (err, ee) => {
      if (err) {
        log.error(err)
        return reply({
          Message: 'Failed to cat file: ' + err,
          Code: 0
        }).code(500)
      }
      ee.on('file', (data) => {
        return reply(data.stream)
      })
    })
  }
}

exports.get = {
  // uses common parseKey method that returns a `key`
  parseArgs: exports.parseKey,

  // main route handler which is called after the above `parseArgs`, but only if the args were valid
  handler: (request, reply) => {
    const key = request.pre.args.key

    request.server.app.ipfs.files.get(key, (err, ee) => {
      if (err) {
        log.error(err)
        return reply({
          Message: 'Failed to get object: ' + err,
          Code: 0
        }).code(500)
      }

      return reply(ee)
    })
  }
}
