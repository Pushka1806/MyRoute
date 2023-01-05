const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const Driver_routes_Schema = new Schema({
        _id : String,
        existAuto: Boolean,
        route: Array,
    })
module.exports = mongoose.model('driver_routes', Driver_routes_Schema)