const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    items :
        {
            type : [Object],
            required : true
        },
    phone :{
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    paymentType : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default : 'order_placed'
    },
    cutlery : {
        type : String,
        required : true
    }
},{
    timestamps : true
})

module.exports = mongoose.model('Order',orderSchema)