'use strict'

const Command = require('ronin').Command
const IPFS = require('../../../ipfs-core')
const bs58 = require('bs58')
const bl = require('bl')
const fs = require('fs')
const mDAG = require('ipfs-merkle-dag')
const DAGNode = mDAG.DAGNode
const debug = require('debug')
const log = debug('cli:object')
log.error = debug('cli:object:error')

module.exports = Command.extend({
  desc: 'Stores input as a DAG object, outputs its key',

  options: {},

  run: (filePath) => {
    var node = new IPFS()

    function parseAndAddNode (buf) {
      let parsed
      try {
        parsed = JSON.parse(buf.toString())
        parsed.Links = parsed.Links || []
      } catch (err) {
        log.error(err)
        throw new Error('failed to parse JSON: ' + err)
      }

      const data = new Buffer(parsed.Data)
      const links = parsed.Links.map((link) => ({
        name: link.Name,
        hash: new Buffer(bs58.decode(link.Hash)),
        size: link.Size
      }))

      const dagNode = new DAGNode(data, links)

      node.object.put(dagNode, (err, obj) => {
        if (err) {
          log.error(err)
          throw err
        }

        console.log('added', bs58.encode(dagNode.multihash()).toString())
      })
    }

    if (filePath) {
      return parseAndAddNode(fs.readFileSync(filePath))
    }

    process.stdin.pipe(bl((err, input) => {
      if (err) {
        log.error(err)
        throw err
      }

      parseAndAddNode(input)
    }))
  }
})
