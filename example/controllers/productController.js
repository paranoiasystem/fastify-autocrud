const boom = require('boom')

const customRoute = {
  method: 'GET',
  url: '/custom',
  handler: async function (req, reply) {
    try {
      reply.type('application/json').code(200).send({ 'customroute': 'ok' })
    } catch (err) {
      throw boom.boomify(err)
    }
  }
}

/* const test = {
  method: 'GET',
  url: '/test',
  handler: async function (req, reply) {
    var schema = require('../models/Product').schema.paths
    var test = {
      response: {
        '200': {
          type: 'object',
          properties: {}
        }
      }
    }
    for (var field in schema) {
      console.log(schema[field].options.type)
      test.response[200].properties[field] = {}
      switch (schema[field].instance) {
        case 'ObjectID':
          test.response[200].properties[field]['type'] = 'string'
          break
        case 'Date':
          test.response[200].properties[field]['type'] = 'string'
          break
        default:
          test.response[200].properties[field]['type'] = schema[field].instance.toLowerCase()
          break
      }
    }
    reply.type('application/json').code(200).send(test)
  }
} */

module.exports = [customRoute]
