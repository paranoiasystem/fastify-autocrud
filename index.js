const boom = require('boom')

function plugin (fastify, opts, next) {
  const schema = generateResponseSchema(opts.Collection)
  const schemaWithBody = generateSchemaWithBody(opts.Collection)
  console.log('\n')
  console.log(JSON.stringify(schema, 2))
  console.log('\n')
  console.log(JSON.stringify(schemaWithBody, 2))
  console.log('\n')

  fastify.route(
    {
      method: 'GET',
      url: '/',
      handler: async function (req, reply) {
        try {
          reply.type('application/json').code(200).send(await opts.Collection.find())
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
      schema: schema,
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
      schema: schemaWithBody,
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
      schema: schemaWithBody,
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
      '20x': {
        type: 'object',
        properties: {}
      }
    }
  }
  for (let path in paths) {
    schema.response['20x'].properties[path] = {}
    switch (paths[path].instance) {
      case 'ObjectID':
        schema.response['20x'].properties[path]['type'] = 'string'
        break
      case 'Date':
        schema.response['20x'].properties[path]['type'] = 'string'
        break
      default:
        schema.response['20x'].properties[path]['type'] = paths[path].instance.toLowerCase()
        break
    }
  }
  return schema
}

const generateSchemaWithBody = (Collection) => {
  let schema = generateResponseSchema(Collection)
  schema.body = {}
  schema.body = schema.response['20x']
  return schema
}

module.exports = plugin
