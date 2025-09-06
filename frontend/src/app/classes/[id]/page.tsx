"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClassByIdOrSlug } from "@/hooks/use-classes";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useAuthState } from "@/hooks/use-auth";
import { getStrapiMediaURL, type CreateBookingData, type ClassOccurrence } from "@/lib/strapi";
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
  const createBookingMutation = useCreateBooking();

  // Debug logging for user data
  console.log("🔍 Class Detail Page - Auth State:", authState);
  console.log("🔍 User Data:", authState?.user);
  console.log("🔍 User firstName:", authState?.user?.firstName);
  console.log("🔍 User lastName:", authState?.user?.lastName);

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

  const handleGuestBooking = async () => {
    if (!guestForm.firstName || !guestForm.lastName || !guestForm.email) {
      toast.error("Please fill in all guest details");
      return;
    }

    if (!classItem) {
      toast.error("Class information not available");
      return;
    }

    // Check if user is already logged in using TanStack Query
    if (authState?.isAuthenticated) {
      // User is logged in, create booking directly
      const bookingData: CreateBookingData = {
        classOccurrence: classItem.id,
        guestFirstName: guestForm.firstName,
        guestLastName: guestForm.lastName,
        guestEmail: guestForm.email,
        status: "confirmed",
        amountPaidCents: classItem.price * 100, // Convert pounds to cents
        currency: "GBP",
      };
      createBookingMutation.mutate(bookingData, {
        onSuccess: () => {
          toast.success("Booking confirmed! You'll receive a confirmation email shortly.");
          setBookingType(null);
          setGuestForm({ firstName: "", lastName: "", email: "" });
        },
        onError: (error: Error) => {
          toast.error(`Booking failed: ${error.message}`);
        },
      });
    } else {
      // For now, show a message about payment implementation
      toast.info("Payment integration with Stripe will be implemented next. For now, please login to book.");
    }
  };

  const handleLoginBooking = () => {
    if (!classItem) {
      toast.error("Class information not available");
      return;
    }

    // Check if user is already logged in using TanStack Query
    if (authState?.isAuthenticated && authState?.user) {
      // User is already logged in, proceed with booking
      const user = authState.user;
      const bookingData: CreateBookingData = {
        classOccurrence: classItem.id,
        guestFirstName: user.firstName || "",
        guestLastName: user.lastName || "",
        guestEmail: user.email || "",
        status: "confirmed",
        amountPaidCents: classItem.price * 100, // Convert pounds to cents
        currency: "GBP",
      };
      createBookingMutation.mutate(bookingData, {
        onSuccess: () => {
          toast.success("Booking confirmed! You'll receive a confirmation email shortly.");
          router.push("/bookings"); // Redirect to bookings page
        },
        onError: (error: Error) => {
          toast.error(`Booking failed: ${error.message}`);
        },
      });
    } else {
      // Redirect to login page with return URL
      router.push(`/login?returnUrl=/classes/${classIdOrSlug}`);
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
                {formatTimeFromString(classItem.startTime)} - {formatTimeFromString(classItem.endTime)} ({getDuration(classItem)})
              </div>
              <div className="flex items-center text-lg">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                {classItem.location}
              </div>
              {classItem.maxCapacity && (
                <div className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  {classItem.maxCapacity} spots available
                </div>
              )}
            </div>

            <div className="text-4xl font-bold text-primary mb-8">{formatPrice(classItem.price)}</div>

            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">{classItem.description || `Join Luna Shree for this exciting ${classItem.title} class. Experience the joy of Bollywood dance in a welcoming and energetic environment. All skill levels are welcome!`}</p>
            </div>
          </div>

          {/* Booking Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book This Class</CardTitle>
                <CardDescription>{authState?.isAuthenticated ? `Welcome back, ${authState.user?.firstName}` : "Choose how you'd like to book your spot"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {authState?.isAuthenticated ? (
                  // Logged-in user: Show direct booking
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Booking Details</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Name: {authState.user?.firstName && authState.user?.lastName ? `${authState.user.firstName} ${authState.user.lastName}` : authState.user?.username || "Not provided"}</p>
                        <p>Email: {authState.user?.email}</p>
                      </div>
                    </div>
                    <Button onClick={handleLoginBooking} className="w-full" size="lg" disabled={createBookingMutation.isPending}>
                      {createBookingMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Booking...
                        </>
                      ) : (
                        `Book Now - ${formatPrice(classItem.price)}`
                      )}
                    </Button>
                  </div>
                ) : (
                  // Not logged in: Show login/guest options
                  <>
                    {!bookingType ? (
                      <div className="space-y-4">
                        <Button onClick={handleLoginBooking} className="w-full" size="lg" disabled={createBookingMutation.isPending}>
                          {createBookingMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Booking...
                            </>
                          ) : (
                            "Login & Book"
                          )}
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
                          <Button onClick={handleGuestBooking} className="w-full" size="lg" disabled={createBookingMutation.isPending}>
                            {createBookingMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Booking...
                              </>
                            ) : (
                              `Proceed to Payment - ${formatPrice(classItem.price)}`
                            )}
                          </Button>
                          <Button onClick={() => setBookingType(null)} variant="ghost" className="w-full" disabled={createBookingMutation.isPending}>
                            Back
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}

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
