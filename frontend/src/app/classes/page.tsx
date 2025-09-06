"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStrapiMediaURL, type ClassOccurrence } from "@/lib/strapi";
import { useClasses } from "@/hooks/use-classes";
import { generateSlug } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, Loader2 } from "lucide-react";

export default function ClassesPage() {
  const { data: classesResponse, isLoading, error } = useClasses();
  const classes = classesResponse?.data || [];

  // Debug logging
  console.log("Classes Page Debug:", {
    isLoading,
    error: error?.message,
    classes,
    classesLength: classes.length,
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

  //   const formatPrice = (priceInCents: number) => {
  //     return `£${(priceInCents / 100).toFixed(2)}`;
  //   };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-bollywood-pink/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Dance Classes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">Join Luna Shree for authentic Bollywood fusion classes in Glasgow. Book your spot up to 2 weeks in advance.</p>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-4">No Classes Available</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">There are currently no classes scheduled for the next 2 weeks. Check back soon or contact Luna to schedule a class.</p>
              <Link href="/contact">
                <Button>Contact Luna</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Upcoming <span className="text-gradient">Classes</span>
                </h2>
                <p className="text-lg text-muted-foreground">{classes.length} classes available for booking</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((classItem: ClassOccurrence) => (
                  <Card key={classItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Class Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-bollywood-pink/20">
                      {classItem.thumbnail ? (
                        <Image src={getStrapiMediaURL(classItem.thumbnail.url)} alt={classItem.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="h-16 w-16 text-primary" />
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl">{classItem.title}</CardTitle>
                      <CardDescription className="text-base">{formatDate(classItem.date)}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Class Details */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(classItem.date)} ({classItem.startTime} - {classItem.endTime})
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {classItem.location}
                        </div>
                        {classItem.maxCapacity && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {classItem.maxCapacity} spots available
                          </div>
                        )}
                      </div>

                      {/* Price and Booking */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-2xl font-bold text-primary">£{classItem.price}</div>
                        <Link href={`/classes/${generateSlug(classItem.title)}`}>
                          <Button>Book Now</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
              <p className="text-muted-foreground">Book classes up to 2 weeks in advance with our easy online system.</p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">All Levels Welcome</h3>
              <p className="text-muted-foreground">Whether you&apos;re a beginner or experienced, our classes welcome everyone.</p>
            </div>
            <div>
              <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Glasgow Location</h3>
              <p className="text-muted-foreground">Convenient studio location in the heart of Glasgow.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
