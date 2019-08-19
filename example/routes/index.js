const productController = require('../controllers/productController')
const autoCRUD = require('../../index')
module.exports = function app(fastify, opts, next) {

    fastify.register(autoCRUD, {
        prefix: '/api/products',
        Collection: require('../models/Product'),
        additionalRoute: productController
    })

    next()
}