const cartModel = require('../models/cartModel')
const logger = require('../helper/logger')

async function addTocart(req, res, next) {
    const { productId } = req.body
    const userId = req.user.id
    try {

        const existingCart = await cartModel.findProduct(userId,productId)

        if(existingCart.length === 0){
            await cartModel.create(userId,productId)
            logger.info(`Item is add to cart for customer_id:${userId}`)
        }
        else{
            await cartModel.update(existingCart[0].id)
            logger.info(`Item is update on cart for customer_id:${userId}`)
        }

       res.status(200).json({message:'Item added successfully'})
    } catch (error) {
        next(error)
    }
}

async function deleteCartItems(req,res,next) {

    try {
        await cartModel.deleteFromCart(req.body.orderId)
        logger.info(`Item is remove from cart for :${req.user.id} and ${req.body.productId}`)
        
        res.status(200).json({message:'Item deleted successfully'})
    } catch (error) {
        next(error)
    }
}

async function getCartItems(req,res,next) {
    try {
        const userId = (req.user && req.user.id) || req.body?.id || req.query?.id
        const result = await cartModel.getById(userId)
        logger.info(`Retrieve Items from Cart for customer_id:${userId}`)

        res.status(200).json({products:result})
    } catch (error) {
        next(error)
    }
}

async function removeCartItem(req,res,next) {
    try {
        const userId = req.user.id
        const {productId} = req.body

        await cartModel.removeFromCart(userId,productId)
        logger.info(`Delete item from cart For customer_id:${userId} and product_id:${productId}`)

        res.status(200).json({message:'Item deleted successfully'})
    } catch (error) {
        next(error)
    }
}

async function decrementItem(req,res,next) {
    try {
        const userId = req.user.id
        const {productId} = req.body
        await cartModel.decrement(userId, productId)
        logger.info(`Decrement item qty for customer_id:${userId} and product_id:${productId}`)
        res.status(200).json({message:'Item decremented successfully'})
    } catch (error) {
        next(error)
    }
}

module.exports = {addTocart,deleteCartItems,getCartItems,removeCartItem,decrementItem}