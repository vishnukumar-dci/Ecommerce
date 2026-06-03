const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const orderModel = require('../models/ordersModel')
const orderItemModel = require('../models/orderItemModel')
const cartModel = require('../models/cartModel')
const logger = require('./logger')

async function checkout(lineItems,orderId,userId) {
  try {
     const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            line_items:lineItems,
            allow_promotion_codes: true,
            // include orderId and userId in metadata so we can verify and process the order
            metadata: { orderId: String(orderId), userId: String(userId) },
            success_url: `http://localhost:8088/order/payment-verify?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:8088/order/payment-verify?session_id={CHECKOUT_SESSION_ID}&cancelled=true`,
        })
      return session.url
  } catch (error) {
      throw error
  }
}

async function logs() {
  try {
    const events = await stripe.events.list({limit:100})

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
        object: obj.object, 
        amount,
        currency,
        status: obj.status || obj.payment_status || null,
        payment_method: obj.payment_method || null,
        customer: obj.customer || null,
      };
    });

    return filterRecord
  } catch (error) {
    throw error
  }
}

module.exports = { 
  checkout,
  logs
}


