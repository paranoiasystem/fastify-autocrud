const fp = require('fastify-plugin')
const boom = require('boom')

function plugin (fastify, opts, next) {
  fastify.get(opts.prefix, opts, async (req, reply) => {
    try {
      reply.type('application/json').code(200).send(await opts.Collection.find())
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  fastify.get(opts.prefix + '/:id', opts, async (req, reply) => {
    try {
      reply.type('application/json').code(200).send(await opts.Collection.findById(req.params.id))
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  fastify.post(opts.prefix, opts, async (req, reply) => {
    try {
      reply.type('application/json').code(201).send(await new opts.Collection(req.body).save())
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  fastify.put(opts.prefix + '/:id', opts, async (req, reply) => {
    try {
      reply.type('application/json').code(200).send(await opts.Collection.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }))
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  fastify.delete(opts.prefix + '/:id', opts, async (req, reply) => {
    try {
      reply.type('application/json').code(204).send(await opts.Collection.deleteOne({ _id: req.params.id }))
    } catch (err) {
      throw boom.boomify(err)
    }
  })

  if (opts.additionalRoute) {
    opts.additionalRoute.forEach(additional => {
      additional.url = opts.prefix + additional.url
      fastify.route(additional)
    })
  }

  next()
}

module.exports = fp(plugin, {
  name: 'fastify-autocrud'
})
