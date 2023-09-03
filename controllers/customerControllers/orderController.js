const Order = require('../../models/order')
const {instance} = require("../../config/razorpay")
const crypto = require("crypto")
exports.capturePayment = async(req, res) => {
    const {totalPrice} = req.body
    const currency = "INR";
    const options = {
        amount: totalPrice * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }
}

exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const userId = req.user.id;
    const { phone, address, payment, cutlery, items } = req.body.payload
    console.log(req.body)
    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET) // doing hashing based on sha256 algorithm and providing the secret the secret to be hashed
        .update(body.toString()) // adding additional information of body to the hash
        .digest("hex"); // finally giving the value of the hash in the specified hexadecimal format

        if(expectedSignature === razorpay_signature) {
            if (!phone || !address || !payment || !cutlery) {
                return res.status(403).json({
                    success: false,
                    message: 'All fields are required'
                })
            }
            let orderDetails = await Order.create({
                customerId: userId, // make changes here
                phone,
                address,
                paymentType : payment,
                cutlery,
                items
            })
            orderDetails = await Order.findById(orderDetails._id).populate('customerId').exec()
            const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('orderPlaced', orderDetails)
            console.log(orderDetails)
            return res.status(200).json({
                success: true,
                orderDetails,
                message: 'Order has been placed Successfully'
            })
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

}

exports.orderController = async (req, res) => {
    try {
        const { phone, address, payment, cutlery } = req.body
        if (!phone || !address || !payment || !cutlery) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required'
            })
        }
        let orderDetails = await Order.create({
            customerId: req.user.id, // make changes here
            phone,
            address,
            paymentType : payment,
            cutlery,
            items: req.body.items
        })
        orderDetails = await Order.findById(orderDetails._id).populate('customerId').exec()
        const eventEmitter = req.app.get('eventEmitter')
        eventEmitter.emit('orderPlaced', orderDetails)
        return res.status(200).json({
            success: true,
            orderDetails,
            message: 'Order has been placed Successfully'
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while placing the order",
            error: error.message
        })
    }
}

exports.showOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order with the specified id not found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Order details fetched successfully',
            data: order
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Error while fetching the order details'
        })
    }
}