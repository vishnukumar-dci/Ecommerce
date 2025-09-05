require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const customerRoute = require('./routes/customerRoute')
const orderRoute = require('./routes/ordersRoute')
const productRoute = require('./routes/productRoute')
const cartRoute = require('./routes/cartRoute')
const errorHandler = require('./middleware/errorHandler')
const bodyParser = require('body-parser')
const {handleWebhook} = require('./helper/webhook')

const app = express()
const PORT = 8088

app.post("/webhook",bodyParser.raw({type:"application/json"}),handleWebhook)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  exposedHeaders: ["Location"],
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/customer',customerRoute)
app.use('/order',orderRoute)
app.use('/product',productRoute)
app.use('/cart',cartRoute)
app.use(errorHandler)

app.listen(PORT,() => {
    console.log(`server is running on ${PORT}`)
})
