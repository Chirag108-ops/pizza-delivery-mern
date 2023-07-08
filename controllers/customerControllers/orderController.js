const { findById } = require('../../models/order')
const Order = require('../../models/order')

exports.orderController = async (req, res) => {
    try{
        const {phone, address,orderId} = req.body
        if(!phone || !address){
            return res.status(403).json({
                success : false,
                message : 'All fields are required'
            })
        }
        let orderDetails = await Order.create({
            customerId: req.user.id, // make changes here
            phone,
            address,
            items : req.body.items
        })
        const orderDetailsPopulated = await Order.findById(orderDetails._id).populate('customerId').exec()
        orderDetailsPopulated.roomId = orderId
        const eventEmitter = req.app.get('eventEmitter')
        eventEmitter.emit('orderPlaced',orderDetailsPopulated)
        return res.status(200).json({
            success : true,
            message : 'Order has been placed Successfully'
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Error while placing the order",
            error : error.message
        })
    }
}

exports.showOrder = async(req, res) => {
    try{
        const {id} = req.params
        const order = await Order.findById(id)
        if(!order){
            return res.status(404).json({
                success : false,
                message : 'Order with the specified id not found'
            })
        }
        return res.status(200).json({
            success : true,
            message : 'Order details fetched successfully',
            data : order
        })
    }
    catch(error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : 'Error while fetching the order details'
        })
    }
}