const api = require('./../index.js').server.select('API')
const resources = require('./../resources')

api.route({
  method: '*',
  path: '/api/v0/object/new',
  config: {
    pre: [
      { method: resources.object.new.parseArgs, assign: 'args' }
    ],
    handler: resources.object.new.handler
  }
})

api.route({
  method: '*',
  path: '/api/v0/object/get',
  config: {
    pre: [
      { method: resources.object.get.parseArgs, assign: 'args' }
    ],
    handler: resources.object.get.handler
  }
})

api.route({
  method: '*',
  path: '/api/v0/object/put',
  config: {
    payload: {
      parse: false,
      output: 'stream'
    },
    pre: [
      { method: resources.object.put.parseArgs, assign: 'args' }
    ],
    handler: resources.object.put.handler
  }
})
