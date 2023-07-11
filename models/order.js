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
        default : 'COD'
    },
    status : {
        type : String,
        default : 'order_placed'
    }
},{
    timestamps : true
})

module.exports = mongoose.model('Order',orderSchema)