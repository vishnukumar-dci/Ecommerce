const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')

router.post('/create',validate.validateBearer,orderController.Paynow)

router.post('/buynow',validate.validateBearer,orderController.Buynow)

router.get('/payment-status',validate.validateInputs,orderController.updateOrder)

router.get('/userhistory',validate.validateBearer,orderController.itemHistory)

router.put('/update',validate.validateBearer,orderController.updateOrder)

//admin
router.get('/history', validate.validateBearer,validate.isAdmin,orderController.orderHistory)

router.get('/log',validate.validateBearer,validate.isAdmin,orderController.stripeLogs);

module.exports = router
