const express = require('express')
const router = express.Router()

const {orderController, showOrder} = require('../controllers/customerControllers/orderController')
const {fetchOrders} = require('../controllers/customerControllers/fetchOrderController')
const {auth} = require('../middlewares/auth')


router.post('/orders',auth,orderController)
router.get('/:id',auth,showOrder)
router.post('/orders-history',auth,fetchOrders)
module.exports = router