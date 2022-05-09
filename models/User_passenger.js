const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const PassengerSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    start: String,
    stop: String,
    routeID: Array,
    waitAuto: Boolean
})

module.exports = mongoose.model('passenger_users', PassengerSchema)