const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')

router.post('/create',validate.validateBearer,orderController.createOrder)

// Stripe will post to this endpoint; do not require bearer validation
router.post('/webhook', express.raw({ type: 'application/json' }), orderController.webhookHandler)

router.get('/payment-status',inputValidate.updateOrder,validate.validateInputs,orderController.updateOrder)

router.get('/userhistory',validate.validateBearer,orderController.itemHistory)

router.get('/history', orderController.orderHistory)

router.put('/update',validate.validateBearer,orderController.updateOrder)

module.exports = router
