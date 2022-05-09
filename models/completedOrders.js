const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const completedOrdersSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    start: String,
    stop: String,
    routeID: Array,
    date: String,
    waitAuto: Boolean,
})

module.exports = mongoose.model('completed_orders', completedOrdersSchema)