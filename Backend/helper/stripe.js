const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handleWebhook = (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(event)
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`⚡ Event received: ${event.type}`);

  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("✅ Checkout completed:");
      console.log("Session ID:", session.id);
      console.log("Customer Email:", session.customer_details?.email);
      console.log("Subtotal:", session.amount_subtotal / 100, session.currency);
      console.log("Total:", session.amount_total / 100, session.currency);
      break;
    }

    /**
     * ✅ Fired when payment intent is successful
     */
    case "charge.succeeded": {
      const intent = event.data.object;
      console.log("💰 Payment succeeded:");
      console.log("PaymentIntent ID:", intent.id);
      console.log("Amount:", intent.amount / 100, intent.currency);
      console.log("Customer:", intent.customer);
      break;
    }

    /**
     * ❌ Fired when payment fails (e.g. insufficient funds)
     */
    case "charge.failed": {
      const intent = event.data.object;
      console.log("❌ Payment failed:");
      console.log("PaymentIntent ID:", intent.id);
      console.log("Amount:", intent.amount / 100, intent.currency);
      console.log("Failure Code:", intent.last_payment_error?.code);
      console.log("Failure Message:", intent.last_payment_error?.message);
      break;
    }

    case "checkout.session.expired":
        console.log("session expired")
    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
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
            success_url: `http://localhost:3000/payment-status?session_Id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
            cancel_url: `http://localhost:3000/payment-status?status=declined&orderId=${orderId}`
        })

      return session.url
  } catch (error) {
      throw error
  }
}

module.exports = { handleWebhook , checkout};


