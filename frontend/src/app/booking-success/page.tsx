"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [sessionData, setSessionData] = useState<{
    status: string;
    customer_email?: string;
    payment_intent?: string;
  } | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const bookingId = searchParams.get("booking_id");

    if (!sessionId) {
      setStatus("failed");
      return;
    }

    // Check the session status
    const checkSessionStatus = async () => {
      try {
        const response = await fetch(`/api/session-status?session_id=${sessionId}`);

        if (!response.ok) {
          throw new Error("Failed to get session status");
        }

        const data = await response.json();
        setSessionData(data);

        if (data.status === "complete") {
          // Update booking status to PAID
          if (bookingId && data.payment_intent) {
            await fetch("/api/confirm-booking", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bookingId,
                paymentIntentId: data.payment_intent,
              }),
            });
          }
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Error checking session status:", error);
        setStatus("failed");
      }
    };

    checkSessionStatus();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Processing Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Your booking is confirmed!</p>
              <p className="text-muted-foreground">Thank you for your payment. You&apos;ll receive a confirmation email shortly.</p>
              {sessionData?.customer_email && <p className="text-sm text-muted-foreground">Confirmation sent to: {sessionData.customer_email}</p>}
            </div>

            <div className="space-y-2">
              <Button onClick={() => router.push("/classes")} className="w-full">
                Browse More Classes
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Failed status
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
            <XCircle className="h-6 w-6" />
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Payment was not completed</p>
            <p className="text-muted-foreground">Your payment could not be processed. Please try again or contact support.</p>
          </div>

          <div className="space-y-2">
            <Button onClick={() => router.push("/classes")} className="w-full">
              Try Booking Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/contact")} className="w-full">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
