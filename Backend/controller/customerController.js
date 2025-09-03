const customerModel = require('../models/customerModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../helper/logger')

async function register(req,res,next) {

        const {name,email,passwords} = req.body
        try {

            const existingCustomer = await customerModel.findByEmail(email)
            
            if(existingCustomer.length > 0){
                logger.error(`Customer already exist for email:${email}`)
                const error = new Error("Customer already exists")
                error.statusCode = 400
                throw error
            }

            const hashPassword = await bcrypt.hash(passwords,10)

            await customerModel.create(name,email,hashPassword)

            logger.info(`Customer Registerd Successfully for email:${email}`)
           
            res.status(201).json({message:'Registration successful'})
        } catch (error) {
            next(error)
        }
    }

async function login(req,res,next) {

    const {email,passwords} = req.body
    try {
        const existingCustomer = await customerModel.findByEmail(email)

        if(existingCustomer.length === 0  ){
            logger.error(`Customer Details Not found For email:${email}`)
            const error = new Error("User Not Found")
            error.statusCode = 404
            throw error
        }
        const validPassword = await bcrypt.compare(passwords,existingCustomer[0].passwords)

          if(!validPassword){
            logger.error(`Invalid Passwords for email:${email}`)
            const error = new Error("Invalid credentials")
            error.statusCode = 404
            throw error
        }

        const token = jwt.sign({id:existingCustomer[0].id,role:existingCustomer[0].roles},process.env.SECRET_KEY,{ expiresIn: '1hr'})

        const user = {
            name:existingCustomer[0].name,
            email:existingCustomer[0].email,
            role:existingCustomer[0].roles,
            image:existingCustomer[0].image_path
        }

        logger.info(`Customer Login Successfully email:${email}`)
        res.status(200).json({message:'Login successful',token:token,user:user})
    } catch (error) {
        next(error)
    }
}

async function update(req,res,next) {

    const{name} = req.body

    const id = req.user.id

    try {
        const existingCustomer = await customerModel.findById(id)

        const imagePath = req.file ? `/uploads/${req.file.filename}`:null
        
        if(existingCustomer.length === 0){
            logger.error(`Customer Not Found for email ${id}`)
            const error = new Error("Customer Not Found")
            error.statusCode = 404
            throw error
        } 

        if(imagePath){
            await customerModel.updateWithImage(id,name,imagePath)
        }else{
            await customerModel.update(id,name)
        }

        const updatedUser = await customerModel.findById(id)
        const user = {
            name:updatedUser[0].name,
            roles:updatedUser[0].roles,
            email:updatedUser[0].email,
            image:updatedUser[0].image_path,
        }
        logger.info(`Customer Details updated for id:${id}`)
        
        res.status(200).json({user})
    } catch (error) {
        next(error)
    }
}


module.exports = {register,update,login}