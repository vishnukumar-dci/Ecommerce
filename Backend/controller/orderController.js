const orderModel = require('../models/ordersModel')
const productModel = require('../models/productsModel')
const cartModel = require('../models/cartModel')
const orderItemModel = require('../models/orderItemModel')
const logger = require('../helper/logger')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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

    // pass orderId and userId to the stripe helper so metadata and redirect urls are set correctly
    // const redirect_url = await stripe.sessionCreation(lineItems, orderId, userId)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            line_items:lineItems,
            allow_promotion_codes: true,
            // include orderId and userId in metadata so webhook can verify and process the order
            metadata: { orderId: String(orderId), userId: String(userId) },
            success_url: `http://localhost:3000/payment-status?session_Id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
            cancel_url: `http://localhost:3000/payment-status?status=declined&orderId=${orderId}`
        })

    logger.info(`Checkout session and order created successfully for id ${userId}`)
    return res.status(200).json({ url: session.url })
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: { name: product[0].product_name },
            unit_amount: Number(product[0].amount) * 100,
          },
          quantity: qty,
        },
      ],
      allow_promotion_codes:true,
      metadata: { orderId: String(orderId), userId: String(userId) },
      success_url: `http://localhost:3000/payment-status?session_Id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `http://localhost:3000/payment-status?status=declined&orderId=${orderId}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

async function updateOrder(req, res, next) {
  let status = "failed";
  let amount = 0;
  const orderId = req.query.orderId;

  try {
    // 1. Verify with Stripe
    if (req.query.session_Id) {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_Id);
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

      amount = Number(paymentIntent.amount) / 100;
      status = session.payment_status === "paid" ? "paid" : "failed";
    } else if (req.query.status) {
      status = req.query.status;
    }

    // 2. Update order row
    await orderModel.update(amount, status, orderId);

    // 3. Get order & items
    const orderRows = await orderModel.getById(orderId);
    // if (!orderRows?.length) {
    //   return res.status(404).json({ success: false, message: "Order not found" });
    // }

    const userId = orderRows[0].user_id || null;

    const orderItems = await orderItemModel.findByOrderId(orderId);
    console.log(orderItems)

    if (status === "paid") {
      // 4. Mark order_items as paid
      for (const item of orderItems) {
        await orderItemModel.updateStatus(orderId, item.product_id, "paid");
        // 5. Remove only purchased items from cart
        await cartModel.removeItem(userId, item.product_id);
      }
    } else {
      // If failed, mark order_items failed but keep cart unchanged
      for (const item of orderItems) {
        await orderItemModel.updateStatus(orderId, item.product_id, "failed");
      }
    }
    logger.info(`Order details updated for orderId = ${orderId}`)
    res.json({
      success: true,
      status,
      orderId,
      amount,
      items: orderItems,
    });
  } catch (error) {
    console.error("updateOrder error:", error);
    next(error);
  }
}

// async function webhookHandler(req, res, next) {
    
//     const sig = req.headers['stripe-signature'];
//     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
//     let event;
//     try {
//         // req.body will be a Buffer because the route uses express.raw()
//         event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
//     } catch (err) {
//         console.error('⚠️  Webhook signature verification failed.', err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     try {
//         if (event.type === 'checkout.session.completed') {
//             const session = event.data.object;
//             console.log('Stripe webhook: checkout.session.completed received for session id=', session.id);
//             const metadata = session.metadata || {};
//             const orderId = metadata.orderId;
//             const userId = metadata.userId ? Number(metadata.userId) : null;

//             console.log('Webhook metadata:', metadata);

//             // double-check payment status
//             const paymentStatus = session.payment_status;
//             if (paymentStatus === 'paid' && orderId) {
//                 // retrieve payment intent to get amount
//                 const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
//                 const amount = Number(paymentIntent.amount) / 100;
//                 console.log(`Webhook: marking order ${orderId} as paid, amount=${amount}`);
//                 // update order record
//                 await orderModel.update(amount, 'paid', orderId);

//                 if (userId) {
//                     const cartItems = await cartModel.find(userId);
//                     console.log(`Webhook: found ${cartItems.length} cart items for user ${userId}`);
//                     for (const item of cartItems) {
//                         console.log(`Webhook: creating order_item for order ${orderId}, product ${item.product_id}, qty ${item.qty}`);
//                         await orderItemModel.create(orderId, item.product_id, item.qty, amount);
//                     }
//                     const del = await cartModel.hardDeleteForUser(userId);
//                     console.log(`Webhook: hardDeleteForUser result for user ${userId}:`, del);
//                 } else {
//                     console.log('Webhook: userId is missing in metadata; cannot clear cart');
//                 }
//             }
//         }
//         res.json({ received: true });
//     } catch (err) {
//         next(err);
//     }
// }

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
    const events = await stripe.events.list({ limit: 100 });

    const filterRecord = events.data.map((ev) => {
      const obj = ev.data.object;

      // Convert created time (UNIX → IST)
      const createdAtIST = new Date(obj.created * 1000).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      // Format currency (Stripe gives lowercase, like "inr")
      const currency = obj.currency ? obj.currency.toUpperCase() : null;

      // Amount formatting (Stripe stores in smallest unit: paise/cents)
      const amount =
        obj.amount || obj.amount_total
          ? (obj.amount || obj.amount_total) / 100
          : null;

      return {
        id: ev.id,
        type: ev.type,
        created_at: createdAtIST,
        object: obj.object, // e.g. payment_intent / checkout.session
        amount,
        currency,
        status: obj.status || obj.payment_status || null,
        payment_method: obj.payment_method || null,
        customer: obj.customer || null,
      };
    });

    const totalLogs = filterRecord.length;

    logger.info(`Stripe logs retrieve sucessfull for Admin`)
    res.status(200).json({
      success: true,
      totalLogs,
      logs: filterRecord,
    });
  } catch (error) {
    console.error("❌ Error fetching Stripe logs:", error);
    next(error);
  }
}



module.exports = {Paynow,updateOrder,itemHistory,orderHistory,stripeLogs,Buynow}
