const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const orderModel = require('../models/ordersModel')
const orderItemModel = require('../models/orderItemModel')
const cartModel = require('../models/cartModel')
const logger = require('./logger')

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(event);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`⚡ Event received: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        const userId = session.metadata?.userId;

        if (!orderId) break;

        const amount = session.amount_total / 100;
        const status = "paid";

        await orderModel.update(amount, status, orderId);

        const orderItems = await orderItemModel.findByOrderId(orderId);

        for (const item of orderItems) {
          await orderItemModel.updateStatus(orderId, item.product_id, "paid");
          await cartModel.removeItem(userId, item.product_id);
        }

        console.log("✅ Checkout completed:");
        logger.info(`Order detail updated for orderId:${orderId} and UserId:${userId}`)
        break;
      }

      case "charge.succeeded": {
        const intent = event.data.object;
        console.log("💰 Payment succeeded:");
        console.log("PaymentIntent ID:", intent.id);
        console.log("Amount:", intent.amount / 100, intent.currency);
        console.log("Customer:", intent.customer);
        break;
      }

      case "payment_intent.payment_failed":
      case "charge.failed": {
        const obj = event.data.object;
        const orderId = obj.metadata?.orderId;

        if (!orderId) break;

        const amount = obj.amount ? obj.amount / 100 : 0;

        await orderModel.update(amount, "failed", orderId);

        const orderItems = await orderItemModel.findByOrderId(orderId);

        for (const item of orderItems) {
          await orderItemModel.updateStatus(orderId, item.product_id, "failed");
        }

        console.log(`❌ Order failed: orderId=${orderId}`);
        break;
      }

      case "checkout.session.expired": {
        console.log("⚠️ Session expired");
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("🔥 Error processing webhook event:", err.message, err.stack);
  }

  res.sendStatus(200);
};


async function checkout(lineItems,orderId,userId) {
  try {
     const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            line_items:lineItems,
            allow_promotion_codes: true,
            // include orderId and userId in metadata so webhook can verify and process the order
            metadata: { orderId: String(orderId), userId: String(userId) },
            success_url: `http://localhost:3000/payment-status?orderId=${orderId}`,
            cancel_url: `http://localhost:3000/payment-status?orderId=${orderId}&status=cancelled`,
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
  handleWebhook , 
  checkout,
  logs
}


