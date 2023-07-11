const Order = require('../../models/order')

exports.fetchOrders = async (req, res) => {
    try {
        const customerId = req.user.id
        const orderDetails = await Order.find({ customerId: customerId }).sort({ 'createdAt': -1 }).populate('customerId').exec()

        return res.status(200).json({
            success: true,
            message: 'All the previous orders are fetched successfully',
            data: orderDetails
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Error while fetching all orders',
            error: error.message
        })
    }
}