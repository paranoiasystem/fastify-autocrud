const productController = require('../controllers/productController')

module.exports = function app (fastify, opts, next) {
  fastify.register(require('../../index'), {
    prefix: '/api/products',
    Collection: require('../models/Product'),
    additionalRoute: productController
  })

  next()
}
