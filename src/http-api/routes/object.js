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
