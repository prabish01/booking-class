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
    console.log("🔥 WEBHOOK ENDPOINT HIT! 🔥", {
      method: ctx.request.method,
      url: ctx.request.url,
      headers: Object.keys(ctx.request.headers),
      hasRawBody: !!ctx.state.rawBody,
      rawBodyLength: ctx.state.rawBody?.length,
    });

    try {
      console.log("Starting webhook processing...", {
        method: ctx.request.method,
        url: ctx.request.url,
        hasRawBody: !!ctx.state.rawBody,
        rawBodyLength: ctx.state.rawBody?.length,
      });

      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const signature = ctx.request.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_fef3d0d2587c6905bad5836c88dbccd3893467b60fc53dd9960c262c7f52afed";

      if (!signature) {
        console.error("Missing stripe-signature header");
        ctx.status = 400;
        ctx.body = { error: "Missing stripe-signature header" };
        return;
      }

      // Get the raw body from ctx.state where our middleware stored it
      const rawBody = ctx.state.rawBody;

      if (!rawBody || !Buffer.isBuffer(rawBody)) {
        console.error("Invalid or missing raw body");
        ctx.status = 400;
        ctx.body = { error: "Missing raw body for webhook verification" };
        return;
      }

      console.log("Processing webhook:", {
        signature: signature ? signature.substring(0, 20) + "..." : "missing",
        bodyLength: rawBody.length,
        bodyType: typeof rawBody,
      });

      let event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
        console.log("Webhook signature verified successfully");
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        ctx.status = 400;
        ctx.body = { error: `Webhook Error: ${err.message}` };
        return;
      }

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
