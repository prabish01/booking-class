"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const calculateDuration = (startTime: string, endTime: string) => {
    // Parse time strings in HH:MM:SS format
    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes; // Convert to total minutes
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);

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
  };

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
      <section className="py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-gradient-to-r from-saffron to-bollywood-pink rounded-full"></div>
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            <span className="text-gradient">Dance Classes</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">Join Luna Shree for authentic Bollywood fusion classes in Glasgow. Book your spot up to 2 weeks in advance.</p>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {classes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-xl mb-8">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Classes Available</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">There are currently no classes scheduled for the next 2 weeks. Check back soon or contact Luna to schedule a class.</p>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-saffron to-bollywood-pink hover:from-saffron/90 hover:to-bollywood-pink/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">Contact Luna</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 mb-6">
                  <div className="w-12 h-1 bg-gradient-to-r from-saffron to-bollywood-pink rounded-full"></div>
                  <Calendar className="w-6 h-6 text-saffron" />
                  <div className="w-12 h-1 bg-gradient-to-r from-saffron to-bollywood-pink rounded-full"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Upcoming <span className="text-gradient">Classes</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">{classes.length} classes available for booking</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((classItem: ClassOccurrence) => (
                  <div key={classItem.id} className="group relative">
                    {/* Main Card */}
                    <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 transform hover:-translate-y-2">
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                          <span className="text-xl font-bold text-gradient">£{classItem.price}</span>
                        </div>
                      </div>

                      {/* Image Section */}
                      <div className="relative h-56 overflow-hidden">
                        {classItem.thumbnail ? (
                          <Image src={getStrapiMediaURL(classItem.thumbnail.url)} alt={classItem.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-saffron/10 via-bollywood-pink/10 to-saffron/5 flex items-center justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-saffron to-bollywood-pink rounded-3xl flex items-center justify-center shadow-xl">
                              <Calendar className="h-10 w-10 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                        {/* Date overlay */}
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                            <p className="text-sm font-semibold text-gray-900">{formatDate(classItem.date)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 space-y-4">
                        {/* Title */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gradient transition-all duration-300">{classItem.title}</h3>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-saffron/20 to-bollywood-pink/20 rounded-xl flex items-center justify-center">
                                <Clock className="h-4 w-4 text-saffron" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatTimeFromString(classItem.startTime)} - {formatTimeFromString(classItem.endTime)}
                                </p>
                                <p className="text-xs text-gray-500">{calculateDuration(classItem.startTime, classItem.endTime)} class</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-saffron/20 to-bollywood-pink/20 rounded-xl flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-bollywood-pink" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{classItem.location}</p>
                                <p className="text-xs text-gray-500">Studio location</p>
                              </div>
                            </div>
                          </div>

                          {classItem.maxCapacity && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-saffron/20 to-bollywood-pink/20 rounded-xl flex items-center justify-center">
                                  <Users className="h-4 w-4 text-saffron" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{classItem.maxCapacity} spots</p>
                                  <p className="text-xs text-gray-500">Available</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Book Button */}
                        <div className="pt-4">
                          <Link href={`/classes/${generateSlug(classItem.title)}`} className="block">
                            <Button className="w-full bg-gradient-to-r from-saffron to-bollywood-pink hover:from-saffron/90 hover:to-bollywood-pink/90 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              Book This Class
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Subtle glow effect on hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-saffron/20 to-bollywood-pink/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50/30 to-pink-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient">Our Classes</span>?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">Experience the perfect blend of traditional Bollywood and modern fusion dance in a welcoming environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:scale-105 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Flexible Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">Book classes up to 2 weeks in advance with our easy online system.</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:scale-105 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">All Levels Welcome</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">Whether you&apos;re a beginner or experienced, our classes welcome everyone.</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:scale-105 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Glasgow Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">Convenient studio location in the heart of Glasgow.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
