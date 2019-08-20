const boom = require('boom')

function plugin (fastify, opts, next) {
  const schema = generateResponseSchema(opts.Collection)
  const schemaWithBody = generateSchemaWithBody(opts.Collection)
  const schemaForGetAll = generateSchemaForGetAll(opts.Collection)

  fastify.route(
    {
      method: 'GET',
      url: '/',
      schemaForGetAll,
      handler: async function (req, reply) {
        try {
          reply.type('application/json').code(200).send({ data: await opts.Collection.find() })
        } catch (err) {
          throw boom.boomify(err)
        }
      }
    }
  )

  fastify.route(
    {
      method: 'GET',
      url: '/:id',
      schema,
      handler: async function (req, reply) {
        try {
          reply.type('application/json').code(200).send(await opts.Collection.findById(req.params.id))
        } catch (err) {
          throw boom.boomify(err)
        }
      }
    }
  )

  fastify.route(
    {
      method: 'POST',
      url: '/',
      schemaWithBody,
      handler: async function (req, reply) {
        try {
          reply.type('application/json').code(201).send(await new opts.Collection(req.body).save())
        } catch (err) {
          throw boom.boomify(err)
        }
      }
    }
  )

  fastify.route(
    {
      method: 'PUT',
      url: '/:id',
      schemaWithBody,
      handler: async function (req, reply) {
        try {
          reply.type('application/json').code(200).send(await opts.Collection.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }))
        } catch (err) {
          throw boom.boomify(err)
        }
      }
    }
  )

  fastify.route(
    {
      method: 'DELETE',
      url: '/:id',
      handler: async function (req, reply) {
        try {
          reply.type('application/json').code(204).send(await opts.Collection.deleteOne({ _id: req.params.id }))
        } catch (err) {
          throw boom.boomify(err)
        }
      }
    }
  )

  opts.additionalRoute.map(route => {
    fastify.route(route)
  })

  next()
}

const generateResponseSchema = (Collection) => {
  let paths = Collection.schema.paths
  let schema = {
    response: {
      '2xx': {
        type: 'object',
        properties: {}
      }
    }
  }
  for (let path in paths) {
    schema.response['2xx'].properties[path] = {}
    switch (paths[path].instance) {
      case 'ObjectID':
        schema.response['2xx'].properties[path]['type'] = 'string'
        break
      case 'Date':
        schema.response['2xx'].properties[path]['type'] = 'string'
        break
      default:
        schema.response['2xx'].properties[path]['type'] = paths[path].instance.toLowerCase()
        break
    }
  }
  return schema
}

const generateSchemaForGetAll = (Collection) => {
  return {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          data: {
            type: 'array'
          }
        }
      }
    }
  }
}

const generateSchemaWithBody = (Collection) => {
  let schema = generateResponseSchema(Collection)
  schema.body = {}
  schema.body = schema.response['2xx']
  return schema
}

module.exports = plugin
