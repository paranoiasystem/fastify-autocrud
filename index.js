const boom = require('boom')

function plugin (fastify, opts, next) {
  fastify.get('/', opts, async (req, reply) => {
    try {
      reply.type('application/json').code(200).send(await opts.Collection.find())
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
