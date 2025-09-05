const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const upload = require('../config/multer')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')

router.get('/list',validate.validateTokenOptional,productController.getItems)

router.get('/cartitem',inputValidate.getCartProduct,validate.validateInputs,validate.validateBearer,productController.getProduct)

//admin access only
router.post('/create',upload.single('image'),inputValidate.createProduct,validate.validateInputs,validate.validateBearer,validate.isAdmin ,productController.createProduct)

router.put('/update',upload.single('image'),inputValidate.updateProduct,validate.validateInputs,validate.validateBearer,validate.isAdmin,productController.updateById)

router.delete('/delete',validate.validateBearer,validate.isAdmin,productController.deleteProduct)

router.get('/homepage',productController.HomePageImage)

module.exports = router