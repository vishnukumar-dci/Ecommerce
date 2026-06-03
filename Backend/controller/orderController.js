const orderModel = require('../models/ordersModel')
const productModel = require('../models/productsModel')
const cartModel = require('../models/cartModel')
const orderItemModel = require('../models/orderItemModel')
const logger = require('../helper/logger')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const payment = require('../helper/stripe')

async function Paynow(req,res,next) {

    const{productIds,qtys} = req.body
    
    const userId = req.user.id
    try {

        const result = await orderModel.create(userId)
        const cartItems = await cartModel.find(userId)
        const products = []

        const orderId = result.insertId;

         for (const item of cartItems) {
            await orderItemModel.create(orderId, item.product_id, item.qty, "pending");
        }
      
        for(let i = 0; i < productIds.length;i++){
            const productId = productIds[i]
            const qty = Number(qtys[i])
            const product = await productModel.getById(productId)
          
            if(product){
                product[0].qty = qty;
                products.push(product[0])
            }
        }
        
        const lineItems = products.map((item) => ({
            price_data:{
                currency:'INR',
                product_data:{name:item.product_name},
                unit_amount:Number(item.amount) * 100,
            },
            quantity:Number(item.qty)
        }))

    const redirect_url = await payment.checkout(lineItems, orderId, userId)

    logger.info(`Checkout session and order created successfully for customer_id:${userId}`)

    return res.status(200).json({url:redirect_url})
    } catch (error) {
        next(error)
    }
}

async function Buynow(req, res, next) {
  const { productId, qty } = req.body;
  const userId = req.user.id;

  try {
    const order = await orderModel.create(userId);
    const orderId = order.insertId;

    const product = await productModel.getById(productId);
    if (!product) throw new Error("Product not found");

    await orderItemModel.create(orderId, productId, qty, "pending");

    const lineItems = [{
      price_data:{
        currency:'INR',
        product_data:{name:product[0].product_name},
        unit_amount:Number(product[0].amount) * 100
      },
      quantity:qty,
    }]

    const redirect_url = await payment.checkout(lineItems,orderId,userId)

    logger.info(`Checkout session and order created successfully for id ${userId}`)
    res.status(200).json({url : redirect_url})
  } catch (err) {
    next(err);
  }
}

async function updateOrder(req, res, next) {
  try {
    const {orderId} = req.query

    await orderModel.updateStatus(orderId)
    res.status(200).json({ success: true, message: "Order status updated to cancelled" })
  } catch (error) {
    console.error("updateOrder error:", error);
    next(error);
  }
}

async function paymentStatus(req,res,next) {
  try {
    const {orderId} = req.query;

    const order = await orderModel.getById(orderId)
    const items = await orderItemModel.findByOrderId(orderId)

    res.status(200).json({
      ...order[0],
      items
    })
    
  } catch (error) {
      next(error)
  }
}

async function itemHistory(req,res,next) {
    
    try{
        const page = parseInt(req.query.page)||1
        const limit = parseInt(req.query.limit)||10
        const offset = (page -1) * limit

        const records = await orderModel.countById(req.user.id)
        const total = records[0].total
        const result = await orderModel.userhistory(req.user.id,limit,offset)

        logger.info(`Customer OrderHistory Retrieved Successfully id=${req.user.id}`)
        res.status(200).json({
            history:result,
            totalRecords:total
        })
    } catch (error) {
        next(error)
    }
}

async function orderHistory(req,res,next) {
    try {
    const page = parseInt(req.query.page)||1
    const limit = parseInt(req.query.limt)||10
    const offset = (page - 1) * limit

    const results = await orderModel.count()
    
    const total = results[0].total

    const result = await orderModel.history(limit,offset) 

    logger.info(`Orders History Retrieve Successfully for Admin`)
    res.status(200).json({
        totalRecords:total,
        history:result
    })
    } catch (error) {
        next(error)
    }
}

async function stripeLogs(req, res, next) {
  try {
    const result = await payment.logs()

    const totalLogs = result.length;

    logger.info(`Stripe logs retrieve sucessfull for Admin`)
    res.status(200).json({
      success: true,
      totalLogs,
      logs: result,
    });

  } catch (error) {
    console.error(" Error fetching Stripe logs:", error);
    next(error);
  }
}

async function verifyPayment(req, res, next) {
  const { session_id, cancelled } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: "session_id query parameter is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    if (!orderId) {
      return res.status(400).json({ message: "Invalid session metadata: orderId missing" });
    }

    if (cancelled === "true" || session.payment_status !== "paid") {
      const amount = session.amount_total ? session.amount_total / 100 : 0;
      const status = cancelled === "true" ? "cancelled" : "failed";

      await orderModel.update(amount, status, orderId);

      const orderItems = await orderItemModel.findByOrderId(orderId);
      for (const item of orderItems) {
        await orderItemModel.updateStatus(orderId, item.product_id, status);
      }

      return res.redirect(`http://localhost:3000/payment-status?orderId=${orderId}&status=${status}`);
    } else {
      const amount = session.amount_total / 100;
      const status = "paid";

      await orderModel.update(amount, status, orderId);

      const orderItems = await orderItemModel.findByOrderId(orderId);
      for (const item of orderItems) {
        await orderItemModel.updateStatus(orderId, item.product_id, "paid");
        await cartModel.removeItem(userId, item.product_id);
      }

      return res.redirect(`http://localhost:3000/payment-status?orderId=${orderId}`);
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.redirect(`http://localhost:3000/payment-status?status=failed`);
  }
}

module.exports = {
  Paynow,
  updateOrder,
  itemHistory,
  orderHistory,
  stripeLogs,
  Buynow,
  paymentStatus,
  verifyPayment,
}
