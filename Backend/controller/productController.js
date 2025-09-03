const productModel = require('../models/productsModel')

async function createProduct(req,res,next) {

    const{name,description,amount} = req.body
    try {

        if(!req.file){
            const error = new Error('Image is required')
            error.statusCode = 400
            throw error
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null

        const result = await productModel.create(name,description,amount,imagePath)

        res.status(201).json({message:'Product added successfully'})
    } catch (error) {
        next(error)
    }
}

async function getItems(req,res,next) {

    const userId = req.user?.id || null
    try {
        const result = await productModel.getAllById(userId)
        res.status(200).json({list:result})
    } catch (error) {
        next(error)
    }
}

async function getProduct(req,res,next) {
    try {
        const {productId} = req.query
        const item = await productModel.getById(productId)

        if(!item){
            res.status(404).send('Product Not found')
        }

        const product = {
            id:item[0].id,
            name:item[0].product_name,
            amount:item[0].amount,
            image_path:item[0].image_path
        }
        res.render("checkout",{
            user:req.session.user,
            product
        })

    } catch (error) {
        next(error)
    }
}

async function updateById(req,res,next) {
    try {
        const {name,description,amount} = req.body
        const productId = req.query.productId
        const imagePath = req.file ? `/uploads/${req.file.filename}`: null

        if(imagePath){
            await productModel.updateWithImage(productId,name,description,amount,imagePath)
        }
        else{
            await productModel.update(productId,name,description,amount)
        }
        res.status(200).json({message:'Product details updated'})
    } catch (error) {
        next(error)
    }
}

async function deleteProduct(req,res,next) {
    try {
        const productId = req.query.productId

        await productModel.deleteById(productId)

        res.status(200).json({message:'Product deleted successfully'})
    } catch (error) {
        next(error)
    }
}

async function HomePageImage(req,res,next) {
    try {
        const result = await productModel.imageRetreive()
        
        res.status(200).json({message:'Product Sent successfully',products:result})
    } catch (error) {
        next(error)
    }
}

module.exports = {createProduct,getItems,getProduct,updateById,deleteProduct,HomePageImage}