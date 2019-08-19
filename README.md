# fastify-autocrud
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

If you want add custom routes

```js
const customController = require('customController')

fastify.register(require('fastify-autocrud'), {
    prefix: '/api/products',
    Collection: require('../models/Product'),
    additionalRoute: customController
})
```

***customController.js**
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