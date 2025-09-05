const {body,query} = require('express-validator')

const registerUser = [
    body('name').notEmpty().trim().withMessage('Name cannot be a empty'),
    body('email').isEmail().withMessage('Must be a Valid Email'),
    body('passwords').isLength({min:8}).trim().withMessage('Password must be at least 8 characters')
]

const loginUser = [
    body('email').isEmail().withMessage('Must be a Valid Email'),
    body('passwords').isLength({min:8}).trim().withMessage('Password must be at least 8 characters')
]

const createProduct = [
    body('name').notEmpty().withMessage('Name cannot be a empty')
                .isString().withMessage('Name must be a string')
                .trim()
                .escape(),
    body('description').notEmpty().withMessage('Descriptions cannot be a empty')
                .isString().withMessage('Name must be a string')
                .trim()
                .escape(),
    body('amount').notEmpty().withMessage('Price is required')
                .isInt({min:10}).withMessage('Price must be greater than 10')
]

const updateProduct = [
    body('name').notEmpty().trim().withMessage('Name cannot be a empty'),
    body('description').notEmpty().trim().withMessage('Descriptions cannot be a empty'),
    body('amount').isInt({min:1}).withMessage('Price must be greater than 1')
]

const getCartProduct = [
    query('productId').isInt({min:0}).withMessage('productId must be integer')
]

const createOrder = [
    body("productIds")
      .isArray({ min: 1 }).withMessage("Product IDs must be a non-empty array"),
    body('qtys')
      .isArray({ min: 1 }).withMessage("qtys must be a non-empty array"),
]

const Cart = [
    body('productId').isInt({min:0})
]

const updateOrder = [
    query('orderId').isInt({min:0}).withMessage('Order id must be a integer')
]

module.exports = {registerUser,loginUser,createOrder,createProduct,updateOrder,updateProduct,getCartProduct,createOrder,Cart}