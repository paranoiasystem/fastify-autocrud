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
    useNewUrlParser: true,
    useFindAndModify: false
  }).catch(err => console.log(err))

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
        tap.is(res.data.customroute, 'ok')
        tap.end()
      }).catch((err) => {
        throw err
      })
    })

    tap.test('Test get all route', (tap) => {
      axios.get('http://localhost:3000/api/products').then((res) => {
        tap.strictEqual(res.status, 200)
        tap.is(res.data.data.length, 0)
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

    tap.test('Test put route', (tap) => {
      axios.put('http://localhost:3000/api/products/' + testId, {
        name: 'unit test 2'
      }).then((res) => {
        tap.strictEqual(res.status, 200)
        tap.is(res.data.name, 'unit test 2')
        tap.end()
      }).catch((err) => {
        throw err
      })
    })

    tap.test('Test get by id route after put', (tap) => {
      axios.get('http://localhost:3000/api/products/' + testId).then((res) => {
        tap.strictEqual(res.status, 200)
        tap.is(res.data.name, 'unit test 2')
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

    tap.test('Test error get by id route', (tap) => {
      axios.get('http://localhost:3000/api/products/wrong_id').then((res) => {
        tap.end()
      }).catch((err) => {
        tap.strictEqual(err.response.status, 500)
        tap.end()
      })
    })

    tap.test('Test error post route', (tap) => {
      axios.post('http://localhost:3000/api/products', {
        _id: 'unit test error'
      }).then((res) => {
        tap.end()
      }).catch((err) => {
        tap.strictEqual(err.response.status, 500)
        tap.end()
      })
    })

    tap.test('Test error put route', (tap) => {
      axios.put('http://localhost:3000/api/products/wrong_id', {
        name: 'unit test 2'
      }).then((res) => {
        tap.end()
      }).catch((err) => {
        tap.strictEqual(err.response.status, 500)
        tap.end()
      })
    })

    tap.test('Test error delete route', (tap) => {
      axios.delete('http://localhost:3000/api/products/wrong_id').then((res) => {
        tap.end()
      }).catch((err) => {
        tap.strictEqual(err.response.status, 500)
        tap.end()
      })
    })

    tap.end()
  })
})
