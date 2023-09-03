const express = require('express')
const router = express.Router()

const { homeController } = require('../controllers/homeController')
const { register, login } = require('../controllers/authController')

router.get('/', homeController)
router.post('/login', login)
router.post('/register', register)
module.exports = router