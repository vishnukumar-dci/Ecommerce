const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const upload = require('../config/multer')
const validate = require('../middleware/validateSessionAndToken')
const inputValidate = require('../middleware/validations')

router.post('/create', upload.single('image'), productController.createProduct)

router.get('/list',productController.getItems)

router.get('/cartitem',inputValidate.getCartProduct,validate.validateInputs,validate.validateBearer,productController.getProduct)

router.put('/update', upload.single('image'), productController.updateById)

router.delete('/delete',productController.deleteProduct)

router.get('/homepage',productController.HomePageImage)

module.exports = router