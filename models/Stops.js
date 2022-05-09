const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const StopsSchema = new Schema({
    _id : String,
    availableStops: Array,
    }
);

module.exports = mongoose.model('passenger_stops', StopsSchema);
