const Order = require('../../models/order')
exports.statusController = async (req, res) => {
    try {
        const { orderId, status } = req.body
        const orderDetails = await Order.findByIdAndUpdate(orderId, {
            status: status
        },
            {
                new: true
            })
        if (!orderDetails) {
            return res.status(404).json({
                success: false,
                message: 'Order Not found'
            })
        }
        const eventEmitter = req.app.get('eventEmitter')
        eventEmitter.emit('orderUpdated', { id: orderId, status: status })

        return res.status(200).json({
            success: true,
            message: 'Order Updated Successfully',
            orderDetails
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error while updating the status',
            error: error.message
        })
    }
}
