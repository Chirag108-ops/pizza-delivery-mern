const express = require('express')
const router = express.Router()

const {orderController} = require('../controllers/adminControllers/orderController')
const {statusController} = require('../controllers/adminControllers/statusController')

const {auth, isAdmin} = require('../middlewares/auth')

router.get('/orders',auth,isAdmin,orderController)
router.post('/order/status',auth,isAdmin,statusController)

module.exports = router