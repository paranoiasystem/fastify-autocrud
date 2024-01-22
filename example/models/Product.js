const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

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

Product.plugin(paginate)

module.exports = mongoose.model('Product', Product)
