const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const userSchema = new Schema({
    _id:{
        login:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        }
    },
    gps:{
        latitude:{
            type: Number,
            required: true
        },
        longitude:{
             type:Number,
            required:true
        } 
    },
    flag:Number,
    routeID: Array,
    route_work:String,
    quanPassengers: Number,
    workAuto: Boolean
})

module.exports = mongoose.model('driver_autos', userSchema);
