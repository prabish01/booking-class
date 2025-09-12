export default {
  async createCheckoutSession(ctx) {
    const { classId, price, user } = ctx.request.body;

    if (!classId || !price) {
      return ctx.badRequest('Class ID and price are required');
    }

    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `Dance Class Booking`,
              },
              unit_amount: Math.round(price * 100), // Convert to pence
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/classes/${classId}`,
        metadata: {
          classId,
          userId: user,
        },
      });

      return { url: session.url };
    } catch (error) {
      console.error('Stripe session creation error:', error);
      return ctx.internalServerError('Could not create checkout session');
    }
  },

  async webhook(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const event = stripe.webhooks.constructEvent(
        ctx.request.body,
        sig,
        endpointSecret
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Create booking record after successful payment
        await strapi.db.query('api::booking.booking').create({
          data: {
            classOccurrence: session.metadata.classId,
            user: session.metadata.userId,
            stripe_payment_id: session.payment_intent,
            booking_date: new Date(),
            publishedAt: new Date(),
          },
        });
      }

      return { received: true };
    } catch (err) {
      console.error('Webhook error:', err);
      return ctx.badRequest('Webhook Error');
    }
  },
};