const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')

router.post('/create',validate.validateBearer,orderController.Paynow)

router.post('/buynow',validate.validateBearer,orderController.Buynow)

// Stripe will post to this endpoint; do not require bearer validation
// router.post('/webhook', express.raw({ type: 'application/json' }), orderController.webhookHandler)

router.get('/payment-status',validate.validateInputs,orderController.updateOrder)

router.get('/userhistory',validate.validateBearer,orderController.itemHistory)

router.put('/update',validate.validateBearer,orderController.updateOrder)

//admin
router.get('/history', validate.validateBearer,validate.isAdmin,orderController.orderHistory)

router.get('/log',orderController.stripeLogs);

module.exports = router
