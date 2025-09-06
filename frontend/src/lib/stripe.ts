import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export interface CreatePaymentIntentData {
  amount: number;
  currency: string;
  bookingId: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export async function createPaymentIntent(data: CreatePaymentIntentData): Promise<CreatePaymentIntentResponse> {
  const response = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create payment intent");
  }

  return response.json();
}

export async function confirmBooking(bookingId: string, paymentIntentId: string): Promise<void> {
  const response = await fetch("/api/confirm-booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookingId, paymentIntentId }),
  });

  if (!response.ok) {
    throw new Error("Failed to confirm booking");
  }
}
