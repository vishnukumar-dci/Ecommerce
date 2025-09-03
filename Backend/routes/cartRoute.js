const express = require('express')
const router = express.Router()
const cartController = require('../controller/cartController')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')

router.post('/create',validate.validateBearer,cartController.addTocart)

router.get('/list',validate.validateBearer,cartController.getCartItems)

router.delete('/delete',validate.validateBearer,cartController.deleteCartItems)

router.put('/update',validate.validateBearer,cartController.removeCartItem)

router.put('/decrement',validate.validateBearer,cartController.decrementItem)

module.exports = router