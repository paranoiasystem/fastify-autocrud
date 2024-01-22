const boom = require('boom')

function plugin (fastify, opts, next) {
  fastify.get('/', opts, async (req, reply) => {
    try {
      opts = { ...opts,
        schema: {
          querystring: {
            type: 'object',
            properties: {
              filters: {
                type: 'string'
              },
              pagination: {
                type: 'string'
              }
            }
          }
        }
      }
      const filterObject = JSON.parse(req.query.filters ||= '{}')
      for (const key in filterObject) {
        if (typeof filterObject[key] === 'string') {
          if (filterObject[key].startsWith('/') && filterObject[key].endsWith('/')) {
            filterObject[key] = new RegExp(filterObject[key].slice(1, -1), 'i')
          }
        }
      }
      const paginateOptions = JSON.parse(req.query.pagination ||= '{"pagination": false}')
      reply.type('application/json').code(200).send(await opts.Collection.paginate(filterObject, paginateOptions))
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  fastify.get('/:id', opts, async (req, reply) => {
    try {
      reply.type('application/json').code(200).send(await opts.Collection.findById(req.params.id))
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  fastify.post('/', opts, async (req, reply) => {
    try {
      reply.type('application/json').code(201).send(await new opts.Collection(req.body).save())
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  fastify.put('/:id', opts, async (req, reply) => {
    try {
      reply.type('application/json').code(200).send(await opts.Collection.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }))
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  fastify.delete('/:id', opts, async (req, reply) => {
    try {
      reply.type('application/json').code(204).send(await opts.Collection.deleteOne({ _id: req.params.id }))
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  opts.additionalRoute.map(route => {
    fastify.route(route)
  })

  next()
}

module.exports = plugin
