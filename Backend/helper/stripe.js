const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function sessionCreation(lineItems) {
    try {
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
        
        return session.url
    } catch (error) {
        throw error
    }
}

module.exports = {sessionCreation}