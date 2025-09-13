import Stripe from "stripe";

export default {
  async createCheckoutSession(ctx) {
    try {
      const { classId, price, user } = ctx.request.body;

      if (!classId || !price) {
        return ctx.badRequest("Class ID and price are required");
      }

      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: `Booking for Class ${classId}`,
              },
              unit_amount: price * 100, // Convert to smallest currency unit
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/classes`,
        metadata: {
          classId,
          userId: user,
        },
      });

      console.log("Stripe session created:", { sessionId: session.id, url: session.url });
      return { url: session.url };
    } catch (error) {
      console.error("Stripe session creation error:", error);
      return ctx.internalServerError("Could not create checkout session");
    }
  },

  async webhook(ctx) {
    const rawBody = ctx.request.body[Symbol.for("unparsedBody")];

    console.log("🔍 Raw body (unparsed):", rawBody);

    const signature = ctx.request.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = Stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);

      ctx.request.event = event;
      console.log("Webhook signature verified successfully");
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      ctx.status = 400;
      ctx.body = { error: `Webhook Error: ${err.message}` };
      return;
    }

    console.log("🔥 WEBHOOK ENDPOINT HIT! 🔥", {
      method: ctx.request.method,
    });

    // // Simple test response first
    // ctx.status = 200;
    // ctx.body = { received: true, test: "webhook reached" };
    // return;

    try {
      console.log("Received event:", event.type, event.id);

      // Handle different event types
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          console.log("Checkout session completed:", session.id);

          try {
            if (!session.metadata?.classId || !session.metadata?.userId) {
              console.error("Missing metadata in checkout session:", session.metadata);
              break;
            }

            // Create booking record
            const booking = await strapi.entityService.create("api::booking.booking", {
              data: {
                publishedAt: new Date(),
                classOccurrence: session.metadata.classId,
                user: session.metadata.userId,
                stripePaymentId: session.payment_intent,
                status: "confirmed",
              },
            });
            console.log("Booking created successfully:", booking.id);
          } catch (error) {
            console.error("Error creating booking:", error);
            // Don't throw here - we want to acknowledge the webhook even if booking creation fails
            // Stripe will retry if we return an error
          }
          break;
        }

        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          console.log("Payment succeeded:", paymentIntent.id);
          // Handle payment success if needed
          break;
        }

        case "charge.succeeded": {
          const charge = event.data.object;
          console.log("Charge succeeded:", charge.id);
          // Handle charge success if needed
          break;
        }

        case "payment_intent.created": {
          console.log("Payment intent created:", event.data.object.id);
          // Usually no action needed for this event
          break;
        }

        case "charge.updated": {
          console.log("Charge updated:", event.data.object.id);
          // Handle charge updates if needed
          break;
        }

        case "payment_intent.payment_failed": {
          const failedPayment = event.data.object;
          console.log("Payment failed:", failedPayment.id);
          // Handle failed payment if needed
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Always respond with success
      ctx.status = 200;
      ctx.body = { received: true };
    } catch (error) {
      console.error("Webhook processing error:", error);

      // Return appropriate error status
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
    }
  },
};
