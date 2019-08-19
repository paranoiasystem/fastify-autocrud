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