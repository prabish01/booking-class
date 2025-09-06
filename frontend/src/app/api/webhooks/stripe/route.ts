import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.bookingId;

      if (bookingId) {
        // Update booking status in Strapi
        try {
          const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
          const strapiToken = process.env.STRAPI_API_TOKEN;

          await fetch(`${strapiUrl}/api/bookings/${bookingId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${strapiToken}`,
            },
            body: JSON.stringify({
              data: {
                status: "confirmed",
                stripePaymentIntentId: paymentIntent.id,
              },
            }),
          });

          console.log("Booking confirmed via webhook:", bookingId);
        } catch (error) {
          console.error("Error updating booking via webhook:", error);
        }
      }
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      const failedBookingId = failedPayment.metadata.bookingId;

      if (failedBookingId) {
        // Update booking status to canceled
        try {
          const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
          const strapiToken = process.env.STRAPI_API_TOKEN;

          await fetch(`${strapiUrl}/api/bookings/${failedBookingId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${strapiToken}`,
            },
            body: JSON.stringify({
              data: {
                status: "canceled",
              },
            }),
          });

          console.log("Booking canceled due to payment failure:", failedBookingId);
        } catch (error) {
          console.error("Error updating failed booking via webhook:", error);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
