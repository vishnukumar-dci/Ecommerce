const express = require('express')
const router = express.Router()
const customersController = require('../controller/customerController')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')
const upload = require('../config/multer') 

router.post('/signup',inputValidate.registerUser,validate.validateInputs,customersController.register)

router.post('/login',inputValidate.loginUser,validate.validateInputs,customersController.login)

router.put('/update',validate.validateBearer,upload.single('image'),customersController.update)

router.get('/logout', (req, res) => {
    try {
        // If you used sessions, you could destroy here. For JWT-based auth, just reply OK.
        return res.status(200).json({ message: 'Logged out' })
    } catch (e) {
        return res.status(200).json({ message: 'Logged out' })
    }
});

module.exports = router

