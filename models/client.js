const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const clientSchema = new mongoose.Schema({
    agencyId: {
        type: ObjectId,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    total_bill:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model('Client',clientSchema)