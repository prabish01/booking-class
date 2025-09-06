import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, paymentIntentId } = await request.json();

    // Here you would typically:
    // 1. Verify the payment with Stripe
    // 2. Update the booking status in Strapi
    // 3. Send confirmation email

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;

    // Update booking status in Strapi
    const response = await fetch(`${strapiUrl}/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: {
          status: "confirmed",
          stripePaymentIntentId: paymentIntentId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }

    const updatedBooking = await response.json();

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    return NextResponse.json({ error: "Failed to confirm booking" }, { status: 500 });
  }
}
