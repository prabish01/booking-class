"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClassByIdOrSlug } from "@/hooks/use-classes";
import { useAuthState } from "@/hooks/use-auth";
import { getStrapiMediaURL, type ClassOccurrence } from "@/lib/strapi";
import { toast } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, Loader2, ArrowLeft } from "lucide-react";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classIdOrSlug = params.id as string;

  // Use TanStack Query hooks
  const { data: classResponse, isLoading, error } = useClassByIdOrSlug(classIdOrSlug);
  const { data: authState } = useAuthState();

  const classItem = classResponse?.data;

  const [bookingType, setBookingType] = useState<"login" | "guest" | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<{
    amount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
  } | null>(null);
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

  const formatTimeFromString = (timeStr: string) => {
    // Parse time string in HH:MM:SS format and convert to AM/PM
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (price: number) => {
    // Price is already in pounds, not cents
    return `£${price.toFixed(2)}`;
  };

  const getDuration = (classItem: ClassOccurrence) => {
    if (classItem.startTime && classItem.endTime) {
      // Parse time strings in HH:MM:SS format
      const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes; // Convert to total minutes
      };

      const startMinutes = parseTime(classItem.startTime);
      const endMinutes = parseTime(classItem.endTime);

      // Handle case where end time is next day (e.g., start: 23:00, end: 01:00)
      let durationMinutes = endMinutes - startMinutes;
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60; // Add 24 hours worth of minutes
      }

      // Format as hr:min
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    }
    return "Duration not specified";
  };

  // Updated handleBooking to integrate Stripe Checkout
  const handleBooking = async () => {
    if (!classItem) {
      toast.error("Class information not available");
      return;
    }

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: classItem.id,
          price: classItem.price,
          user: authState?.user?.id || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Stripe Checkout session");
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
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
    // A slug should have at least one hyphen to distinguish from documentId
    const isSlugParam = /^[a-z0-9]+-[a-z0-9-]+$/.test(classIdOrSlug);
    const errorMessage = isSlugParam ? "Class not found. Slug-based URLs require the slug field to be added to your Strapi content type." : error?.message || "Class not found";

    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{errorMessage}</p>
          <Link href="/classes">
            <Button>Back to Classes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/classes" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="font-medium">Back to Classes</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Complete Your Booking</h1>
            <p className="text-gray-600">Review your class details and secure your spot</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Class Summary - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Class Overview Card */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Class Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Class Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-full sm:w-32 h-32 bg-gradient-to-br from-saffron/10 to-bollywood-pink/10 rounded-lg overflow-hidden">
                        {classItem.thumbnail ? (
                          <Image src={getStrapiMediaURL(classItem.thumbnail.url)} alt={classItem.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-saffron" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Class Info */}
                    <div className="flex-grow space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900">{classItem.title}</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-saffron" />
                          <span>{formatDate(classItem.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-bollywood-pink" />
                          <span>
                            {formatTimeFromString(classItem.startTime)} - {formatTimeFromString(classItem.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-saffron" />
                          <span>{classItem.location}</span>
                        </div>
                        {classItem.maxCapacity && (
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-bollywood-pink" />
                            <span>{classItem.maxCapacity} spots available</span>
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span> {getDuration(classItem)}
                      </div>
                    </div>
                  </div>

                  {/* Class Description */}
                  {classItem.description && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-2">About This Class</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{classItem.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information Card */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {authState?.isAuthenticated ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-green-800">Signed In</h4>
                          <div className="mt-1 text-sm text-green-700">
                            <p>{authState.user?.firstName && authState.user?.lastName ? `${authState.user.firstName} ${authState.user.lastName}` : authState.user?.username || "Account User"}</p>
                            <p>{authState.user?.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!bookingType ? (
                        <div className="space-y-4">
                          <p className="text-gray-600 text-sm">Choose how you&apos;d like to proceed with your booking:</p>
                          <div className="space-y-3">
                            <Button onClick={handleBooking} className="w-full justify-center bg-gradient-to-r from-saffron to-bollywood-pink hover:from-saffron/90 hover:to-bollywood-pink/90 text-white font-medium">
                              Sign In to Book
                            </Button>
                            <Button onClick={() => setBookingType("guest")} variant="outline" className="w-full justify-center border-gray-300 hover:border-saffron hover:bg-saffron/5">
                              Continue as Guest
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                First Name *
                              </Label>
                              <Input id="firstName" value={guestForm.firstName} onChange={(e) => setGuestForm((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Enter first name" className="mt-1 focus:border-saffron focus:ring-saffron/20" required />
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                Last Name *
                              </Label>
                              <Input id="lastName" value={guestForm.lastName} onChange={(e) => setGuestForm((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Enter last name" className="mt-1 focus:border-saffron focus:ring-saffron/20" required />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                              Email Address *
                            </Label>
                            <Input id="email" type="email" value={guestForm.email} onChange={(e) => setGuestForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Enter email address" className="mt-1 focus:border-saffron focus:ring-saffron/20" required />
                          </div>
                          <Button onClick={() => setBookingType(null)} variant="ghost" className="text-sm text-gray-600 hover:text-gray-800">
                            ← Back to options
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Item Details */}
                    <div className="pb-4 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900 text-sm">{classItem.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{formatDate(classItem.date)}</p>
                          <p className="text-xs text-gray-600">
                            {formatTimeFromString(classItem.startTime)} - {formatTimeFromString(classItem.endTime)}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-gray-900">{formatPrice(classItem.price)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gradient">{formatPrice(classItem.price)}</span>
                    </div>

                    {/* Complete Booking Button */}
                    <div className="pt-4">
                      {authState?.isAuthenticated || (bookingType === "guest" && guestForm.firstName && guestForm.lastName && guestForm.email) ? (
                        <Button onClick={handleBooking} className="w-full bg-gradient-to-r from-saffron to-bollywood-pink hover:from-saffron/90 hover:to-bollywood-pink/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                          Complete Booking
                        </Button>
                      ) : (
                        <Button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-3 cursor-not-allowed" size="lg">
                          Complete Customer Info
                        </Button>
                      )}
                    </div>

                    {/* Security & Policies */}
                    <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>SSL Secured Payment</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Instant Confirmation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        <span>24hr Cancellation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
