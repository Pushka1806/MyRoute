const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const userSchema = new Schema({
    id: {
            type: String,
            required: true,
            unique: true
        }
})

module.exports = mongoose.model('driver_name', userSchema)
