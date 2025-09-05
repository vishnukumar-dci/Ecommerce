const logger = require('../helper/logger')

function errorHandler(err,req,res,next){
    console.log(err)
    const statusCode = err.statusCode || 500
    const message = err.message 
    logger.error(`Error on ${message}`)
    res.status(statusCode).json({message:message})
}
module.exports = errorHandler;