const orderModel = require('../models/ordersModel')
const productModel = require('../models/productsModel')
const cartModel = require('../models/cartModel')
const orderItemModel = require('../models/orderItemModel')
const logger = require('../helper/logger')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function createOrder(req,res,next) {

    const{productIds,qtys} = req.body
    
    const userId = req.user.id
    try {

        const result = await orderModel.create(userId)

        const products = []

        const orderId = result.insertId;
        console.log(orderId)
      
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

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            line_items:lineItems,
            allow_promotion_codes: true,
            // include orderId and userId in metadata so webhook can verify and process the order
            metadata: { orderId: String(orderId), userId: String(userId) },
            success_url: `http://localhost:8088/order/payment-status?session_Id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
            cancel_url: `http://localhost:8088/order/payment-status?status=declined&orderId=${orderId}`
        })

        return res.status(200).json({ url: session.url })
    } catch (error) {
        next(error)
    }
}

async function updateOrder(req,res,next) {

    let status = "failed"
    let amount = 0
    const orderId = req.query.orderId
    try {
        if (req.query.session_Id) {

            const session = await stripe.checkout.sessions.retrieve(req.query.session_Id);
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent)
            amount = Number(paymentIntent.amount)/100;
            status = session.payment_status === "paid" ? "paid" : "failed";

        } else if (req.query.status) {
            status = req.query.status
        }

        await orderModel.update(amount,status,orderId)

        const orderRows = await orderModel.getById(orderId)
        const userId = orderRows && orderRows[0] ? orderRows[0].user_id : null

        if (userId) {
            const cartItems = await cartModel.find(userId)
            console.log(`updateOrder: found ${cartItems.length} cart items for user ${userId}`);
            for(const item of cartItems){
                console.log(`updateOrder: creating order_item for order ${orderId}, product ${item.product_id}, qty ${item.qty}`);
                await orderItemModel.create(orderId,item.product_id,item.qty,amount)
            }
            if (status === 'paid') {
                const del = await cartModel.hardDeleteForUser(userId)
                console.log(`updateOrder: hardDeleteForUser result for user ${userId}:`, del);
            }
        }

        res.redirect(302, 'http://localhost:3000/orders')
    } catch (error) {
        next(error)
    }
}

async function webhookHandler(req, res, next) {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        // req.body will be a Buffer because the route uses express.raw()
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('⚠️  Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Stripe webhook: checkout.session.completed received for session id=', session.id);
            const metadata = session.metadata || {};
            const orderId = metadata.orderId;
            const userId = metadata.userId ? Number(metadata.userId) : null;

            console.log('Webhook metadata:', metadata);

            // double-check payment status
            const paymentStatus = session.payment_status;
            if (paymentStatus === 'paid' && orderId) {
                // retrieve payment intent to get amount
                const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
                const amount = Number(paymentIntent.amount) / 100;
                console.log(`Webhook: marking order ${orderId} as paid, amount=${amount}`);
                // update order record
                await orderModel.update(amount, 'paid', orderId);

                // move cart items to order_items and then delete them
                if (userId) {
                    const cartItems = await cartModel.find(userId);
                    console.log(`Webhook: found ${cartItems.length} cart items for user ${userId}`);
                    for (const item of cartItems) {
                        console.log(`Webhook: creating order_item for order ${orderId}, product ${item.product_id}, qty ${item.qty}`);
                        await orderItemModel.create(orderId, item.product_id, item.qty, amount);
                    }
                    const del = await cartModel.hardDeleteForUser(userId);
                    console.log(`Webhook: hardDeleteForUser result for user ${userId}:`, del);
                } else {
                    console.log('Webhook: userId is missing in metadata; cannot clear cart');
                }
            }
        }
        res.json({ received: true });
    } catch (err) {
        next(err);
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
    res.status(200).json({
        totalRecords:total,
        history:result
    })
    } catch (error) {
        next(error)
    }
}

async function stripeLogs(req,res,next) {
    try {
        const paymentIntents = await stripe.paymentIntents.list({limit:30})
        
        const filterRecord = paymentIntents.data.map(pi => ({
            id:pi.id,
            amount:pi.amount,
            amount_received:pi.amount_received,
            currency:pi.currency,
            status:pi.status,
            payment_method_type:pi.payment_method_types,
            created_at:pi.created
        }))
        const totalLogs = filterRecord.length;
        res.status(200).json({logs:filterRecord,totalLogs})

    } catch (error) {
        next(error)
    }
}

module.exports = {createOrder,updateOrder,itemHistory,orderHistory, webhookHandler,stripeLogs}
