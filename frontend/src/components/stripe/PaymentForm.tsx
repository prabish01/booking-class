"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPaymentIntent, confirmBooking } from "@/lib/stripe";
import { toast } from "@/lib/toast";
import { Loader2 } from "lucide-react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#424770",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
      iconColor: "#9e2146",
    },
  },
};

interface PaymentFormProps {
  amount: number; // Amount in pounds
  currency: string;
  bookingId: string;
  onSuccess: () => void;
  onCancel: () => void;
  customerName: string;
  customerEmail: string;
}

export default function PaymentForm({ amount, currency, bookingId, onSuccess, onCancel, customerName, customerEmail }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not loaded. Please refresh the page.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        amount: Math.round(amount * 100), // Convert pounds to pence
        currency,
        bookingId,
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      });

      if (error) {
        console.error("Payment failed:", error);
        toast.error(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm booking in backend
        await confirmBooking(bookingId, paymentIntentId);
        toast.success("Payment successful! Your booking is confirmed.");
        onSuccess();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Card Details</label>
              <div className="p-3 border rounded-md bg-background">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
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
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={!stripe || isProcessing} className="flex-1" size="lg">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay £${amount.toFixed(2)}`
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing} size="lg">
              Cancel
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>Your payment is secured by Stripe. We never store your card details.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
