const express = require('express')
const router = express.Router()
const customersController = require('../controller/customerController')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')
const upload = require('../config/multer') 

router.post('/signup',inputValidate.registerUser,validate.validateInputs,customersController.register)

router.post('/login',inputValidate.loginUser,validate.validateInputs,customersController.login)

router.put('/update',validate.validateBearer,upload.single('image'),customersController.update)

module.exports = router

