const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const upload = require('../config/multer')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')

router.get('/list',productController.getItems)

router.get('/cartitem',inputValidate.getCartProduct,validate.validateInputs,validate.validateBearer,productController.getProduct)

//admin access only
router.post('/create',validate.validateBearer,validate.isAdmin ,upload.single('image'), productController.createProduct)

router.put('/update', validate.validateBearer,validate.isAdmin,upload.single('image'), productController.updateById)

router.delete('/delete',validate.validateBearer,validate.isAdmin,productController.deleteProduct)

router.get('/homepage',validate.validateBearer,validate.isAdmin,productController.HomePageImage)

module.exports = router