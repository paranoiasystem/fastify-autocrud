'use strict'

const fp = require('fastify-plugin')

function fastifyAutoCRUD (fastify, opts, next) {
    fastify.get('/', opts, async (req, reply) => {
        try {
            reply.type('application/json').code(200).send(await opts.Collection.find())
        } catch(err) {
            throw boom.boomify(err)
        }
    })

    fastify.get('/:id', opts, async (req, reply) => {
        try {
            reply.type('application/json').code(200).send(await opts.Collection.findById(req.params.id))
        } catch(err) {
            throw boom.boomify(err)
        }
    })

    fastify.post('/', opts, async (req, reply) => {
        try { 
            reply.type('application/json').code(201).send(await new opts.Collection(req.body).save())
        } catch(err) {
            throw boom.boomify(err)
        }
    })

    fastify.put('/:id', opts, async (req, reply) => {
        try {
            reply.type('application/json').code(200).send(await opts.Collection.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }))
        } catch(err) {
            throw boom.boomify(err)
        }
    })

    fastify.delete('/:id', opts, async(req, reply) => {
        try {
            reply.type('application/json').code(204).send(await opts.Collection.deleteOne({ _id: req.params.id }))
        } catch(err) {
            throw boom.boomify(err)
        }
    })

    if(opts.additionalRoute) {
        opts.additionalRoute.forEach(additional => {
            fastify.route(additional)
        })
    }

    next()
}

module.exports = fp(fastifyAutoCRUD, {
    fastify: '>=2.0.0',
    name: 'fastify-autocrud'
})