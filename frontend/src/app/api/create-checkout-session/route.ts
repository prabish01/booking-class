import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, customerEmail, customerName } = await request.json();

    // Create a Checkout Session with embedded UI mode
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Dance Class Booking",
              description: `Booking confirmation for dance class`,
            },
            unit_amount: Math.round(amount * 100), // Convert pounds to pence
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      customer_email: customerEmail,
      metadata: {
        bookingId: bookingId,
        customerName: customerName,
      },
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
