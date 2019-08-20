'use strict'

const tap = require('tap')
const axios = require('axios')
const Fastify = require('fastify')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

var testId = null

tap.test('Test fastify-autocrud', (tap) => {
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

    tap.test('Test custom route', (tap) => {
      axios.get('http://localhost:3000/api/products/custom').then((res) => {
        tap.strictEqual(res.status, 200)
        tap.is(JSON.stringify(res.data), '{"customroute":"ok"}')
        tap.end()
      }).catch((err) => {
        throw err
      })
    })

    tap.test('Test get all route', (tap) => {
      axios.get('http://localhost:3000/api/products').then((res) => {
        tap.strictEqual(res.status, 200)
        tap.is(JSON.stringify(res.data), '[]')
        tap.end()
      }).catch((err) => {
        throw err
      })
    })

    tap.test('Test post route', (tap) => {
      axios.post('http://localhost:3000/api/products', {
        name: 'unit test'
      }).then((res) => {
        tap.strictEqual(res.status, 201)
        tap.is(res.data.name, 'unit test')
        testId = res.data._id
        tap.end()
      }).catch((err) => {
        throw err
      })
    })

    tap.test('Test get by id route', (tap) => {
      axios.get('http://localhost:3000/api/products/' + testId).then((res) => {
        tap.strictEqual(res.status, 200)
        tap.is(res.data.name, 'unit test')
        tap.end()
      }).catch((err) => {
        throw err
      })
    })

    tap.test('Test delete route', (tap) => {
      axios.delete('http://localhost:3000/api/products/' + testId).then((res) => {
        tap.strictEqual(res.status, 204)
        tap.end()
      }).catch((err) => {
        throw err
      })
    })

    tap.end()
  })
})
