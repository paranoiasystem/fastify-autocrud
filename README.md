# fastify-autocrud

<div align="center">

[![build status](https://img.shields.io/travis/org/paranoiasystem/fastify-autocrud)](https://travis-ci.org/paranoiasystem/fastify-autocrud)
[![issues](https://img.shields.io/github/issues/paranoiasystem/fastify-autocrud)](https://github.com/paranoiasystem/fastify-autocrud/issues)
[![Coverage Status](https://coveralls.io/repos/github/paranoiasystem/fastify-autocrud/badge.svg?branch=master)](https://coveralls.io/github/paranoiasystem/fastify-autocrud?branch=master)
[![license](https://img.shields.io/github/license/paranoiasystem/fastify-autocrud)](./LICENSE)
![version](https://img.shields.io/npm/v/fastify-autocrud)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Beerpay](https://img.shields.io/beerpay/paranoiasystem/fastify-autocrud)](https://beerpay.io/paranoiasystem/fastify-autocrud)

</div>

Plugin for autogenerate CRUD routes as fast as possible. 

## Install 

```
npm i fastify-autocrud --save
```

## Usage

```js
fastify.register(require('fastify-autocrud'), {
    prefix: '/api/products',
    Collection: require('../models/Product')
})
```

**_Product.js_**
```js
const mongoose = require('mongoose')

const Product = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  cost: Number,
  price: Number,
  qty: Number
}, {
  timestamps: true
})

module.exports = mongoose.model('Product', Product)
```

If you want add custom routes

```js
const customController = require('customController')

fastify.register(require('fastify-autocrud'), {
    prefix: '/api/products',
    Collection: require('../models/Product'),
    additionalRoute: customController
})
```

**_customController.js_**
```js
const boom = require('boom')

const customRoute = {
    method: 'GET',
    url: '/custom',
    handler: async function (req, reply) {
        try {
            reply.type('application/json').code(200).send({ "customroute": "ok" })
        } catch (err) {
            throw boom.boomify(err)
        }
    }
}

module.exports = [customRoute]
```

## License

Licensed under [MIT](./LICENSE).
