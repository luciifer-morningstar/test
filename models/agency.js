const mongoose = require('mongoose')
const agencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address:{
        type:String,
        required:true
    },
    address_2:{
        type:String,
        required:false
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model('Agency',agencySchema)