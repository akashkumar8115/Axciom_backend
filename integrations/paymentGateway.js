const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

class PaymentGateway {
    async processPayment(userId, amount, description) {
        try {
            const user = await User.findById(userId);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100, // Convert to cents
                currency: 'usd',
                customer: user.stripeCustomerId,
                description
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        } catch (error) {
            logger.error('Payment processing failed:', error);
            throw error;
        }
    }

    async createRefund(paymentIntentId, amount) {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount * 100
            });
            return refund;
        } catch (error) {
            logger.error('Refund processing failed:', error);
            throw error;
        }
    }
}
