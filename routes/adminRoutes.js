const express = require('express')
const router = express.Router()

const {orderController} = require('../controllers/adminControllers/orderController')
const {statusController} = require('../controllers/adminControllers/statusController')
const {deleteMenu, updateMenu, addMenu} = require('../controllers/adminControllers/menuController')
const {auth, isAdmin} = require('../middlewares/auth')

router.get('/orders',auth,isAdmin,orderController)
router.post('/order/status',auth,isAdmin,statusController)
router.post('/menu/delete',auth,isAdmin,deleteMenu)
router.post('/menu/update',auth,isAdmin,updateMenu)
router.post('/menu/add',auth,isAdmin,addMenu)
module.exports = router