const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

function validateBearer(req, res, next) {
    try {
        const auth = req.headers['authorization'] || ''
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : null

        if (!token) return res.status(401).json({ message: 'Unauthorized: token missing' })

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) return res.status(401).json({ message: 'Unauthorized: invalid token' })
            req.user = user
            next()
        })

    } catch (e) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

function isAdmin(req, res, next) {

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: 'Access denied : Admin only' })
    }
    next();
}

function validateInputs(req, res, next) {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }
    next()
}

function validateTokenOptional(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader)
            return next()
        const token = authHeader.split(" ")[1]

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) 
                return next()
            req.user = user
            next()
        })
    } catch (error) {
        return next()
    }
}

module.exports = { validateBearer, isAdmin, validateInputs ,validateTokenOptional};