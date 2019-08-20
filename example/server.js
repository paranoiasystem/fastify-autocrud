const fastify = require('fastify')({
  logger: true
})

require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URI, {
  useCreateIndex: true,
  useNewUrlParser: true
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

fastify.register(require('./routes'))

const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0')
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
