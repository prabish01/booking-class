"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeEmbeddedCheckoutProps {
  bookingId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  onCancel: () => void;
}

export default function StripeEmbeddedCheckout({ bookingId, amount, customerEmail, customerName, onCancel }: StripeEmbeddedCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create checkout session
    const createCheckoutSession = async () => {
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            amount,
            customerEmail,
            customerName,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout session");
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error creating checkout session:", error);
        setError("Failed to initialize payment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    createCheckoutSession();
  }, [bookingId, amount, customerEmail, customerName]);

  const fetchClientSecret = async () => {
    // This function is required by EmbeddedCheckoutProvider
    // but we've already fetched the client secret in useEffect
    return clientSecret;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preparing Payment</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Setting up secure payment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-destructive">{error}</p>
          <div className="flex space-x-4">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Try Again
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Initialization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to initialize payment. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span>£{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span>{customerEmail}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div id="checkout">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="ghost" onClick={onCancel}>
            Cancel Booking
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center mt-4">
          <p>Your payment is secured by Stripe. We never store your card details.</p>
        </div>
      </CardContent>
    </Card>
  );
}
