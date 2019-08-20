'use strict'

const tap = require('tap')
const axios = require('axios')
const Fastify = require('fastify')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

tap.test('Test custom route fastify-autocrud', (tap) => {
  const fastify = Fastify()
  dotenv.config()

  mongoose.connect(process.env.DATABASE_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
  }).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))

  fastify.register(require('../example/routes'))

  tap.tearDown(() => {
    mongoose.disconnect()
    fastify.close()
  })

  fastify.listen(3000, '0.0.0.0', err => {
    tap.error(err)

    axios.get('http://localhost:3000/api/products/custom').then((res) => {
      tap.strictEqual(res.status, 200)
      tap.is(JSON.stringify(res.data), '{"customroute":"ok"}')
      tap.end()
    }).catch((err) => {
      throw err
    })
  })
})

tap.test('Test get all route fastify-autocrud', (tap) => {
  const fastify = Fastify()
  dotenv.config()

  mongoose.connect(process.env.DATABASE_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
  }).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))

  fastify.register(require('../example/routes'))

  tap.tearDown(() => {
    mongoose.disconnect()
    fastify.close()
  })

  fastify.listen(3000, '0.0.0.0', err => {
    tap.error(err)

    axios.get('http://localhost:3000/api/products').then((res) => {
      tap.strictEqual(res.status, 200)
      tap.is(JSON.stringify(res.data), '[]')
      tap.end()
    }).catch((err) => {
      throw err
    })
  })
})
