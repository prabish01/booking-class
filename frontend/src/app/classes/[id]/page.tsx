"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClassOccurrence } from "@/hooks/api";
import { getStrapiMediaURL } from "@/lib/strapi";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, Loader2, ArrowLeft } from "lucide-react";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const { data: classResponse, isLoading, error } = useClassOccurrence(classId);
  const classItem = classResponse?.data;

  const [bookingType, setBookingType] = useState<"login" | "guest" | null>(null);
  const [guestForm, setGuestForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (priceInCents: number) => {
    return `£${(priceInCents / 100).toFixed(2)}`;
  };

  const handleGuestBooking = async () => {
    if (!guestForm.firstName || !guestForm.lastName || !guestForm.email) {
      alert("Please fill in all guest details");
      return;
    }

    // TODO: Implement booking creation and payment flow
    alert("Guest booking flow would be implemented here with Stripe payment");
  };

  const handleLoginBooking = () => {
    // TODO: Redirect to login page with return URL
    router.push(`/login?returnUrl=/classes/${classId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (error || !classItem) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error?.message || "Class not found"}</p>
          <Link href="/classes">
            <Button>Back to Classes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/classes" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Class Details */}
          <div>
            {/* Class Image */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 to-bollywood-pink/20 rounded-lg overflow-hidden mb-6">
              {classItem.thumbnail ? (
                <Image src={getStrapiMediaURL(classItem.thumbnail.url)} alt={classItem.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="h-24 w-24 text-primary" />
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{classItem.title}</h1>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                {formatDate(classItem.date)}
              </div>
              <div className="flex items-center text-lg">
                <Clock className="h-5 w-5 mr-3 text-primary" />
                {formatTime(classItem.date)} ({classItem.durationMinutes} minutes)
              </div>
              <div className="flex items-center text-lg">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                {classItem.location}
              </div>
              {classItem.spotsAvailable && (
                <div className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  {classItem.spotsAvailable} spots available
                </div>
              )}
            </div>

            <div className="text-4xl font-bold text-primary mb-8">{formatPrice(classItem.price)}</div>

            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">Join Luna Shree for this exciting {classItem.title} class. Experience the joy of Bollywood dance in a welcoming and energetic environment. All skill levels are welcome!</p>
            </div>
          </div>

          {/* Booking Section */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book This Class</CardTitle>
                <CardDescription>Choose how you&apos;d like to book your spot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!bookingType ? (
                  <div className="space-y-4">
                    <Button onClick={handleLoginBooking} className="w-full" size="lg">
                      Login & Book
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>
                    <Button onClick={() => setBookingType("guest")} variant="outline" className="w-full" size="lg">
                      Book as Guest
                    </Button>
                  </div>
                ) : bookingType === "guest" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={guestForm.firstName} onChange={(e) => setGuestForm((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={guestForm.lastName} onChange={(e) => setGuestForm((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Enter your last name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={guestForm.email} onChange={(e) => setGuestForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Enter your email" />
                    </div>
                    <div className="space-y-3 pt-4">
                      <Button onClick={handleGuestBooking} className="w-full" size="lg">
                        Proceed to Payment - {formatPrice(classItem.price)}
                      </Button>
                      <Button onClick={() => setBookingType(null)} variant="ghost" className="w-full">
                        Back
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="text-sm text-muted-foreground">
                  <p>• Secure payment with Stripe</p>
                  <p>• Instant booking confirmation</p>
                  <p>• Cancel up to 24 hours before class</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
