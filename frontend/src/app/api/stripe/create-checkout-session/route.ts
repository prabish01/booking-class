import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { classId, price, user } = await request.json();

    // Call your backend API to create a Stripe checkout session
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId, price, user }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
