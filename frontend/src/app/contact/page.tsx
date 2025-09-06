"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-bollywood-pink/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Get in Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">Ready to start your Bollywood dance journey? Have questions about classes or want to book a private session? We&apos;d love to hear from you!</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Studio Location</h3>
                      <p className="text-muted-foreground">
                        Glasgow Dance Studio
                        <br />
                        123 Sauchiehall Street
                        <br />
                        Glasgow, G2 3EW
                        <br />
                        Scotland
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">hello@masalamoves.com</p>
                      <p className="text-sm text-muted-foreground mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">+44 123 456 7890</p>
                      <p className="text-sm text-muted-foreground mt-1">Available Mon-Fri, 9AM-6PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Studio Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Monday - Friday: 6:00 PM - 10:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: 2:00 PM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Need something specific? Here are some quick links to help you get started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/classes">View Class Schedule</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/about">About Luna Shree</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="tel:+441234567890">Call Directly</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="mailto:hello@masalamoves.com">Send Email</a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we&apos;ll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                      <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="Your full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="your.email@example.com" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+44 123 456 7890" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleInputChange} required placeholder="What is this about?" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required placeholder="Tell us more about your inquiry..." rows={6} />
                      </div>

                      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Here are some common questions we receive. If you don&apos;t find what you&apos;re looking for, feel free to contact us!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Do I need prior dance experience?</h3>
                <p className="text-muted-foreground">Not at all! Our classes welcome all levels, from complete beginners to experienced dancers. Luna tailors her teaching to accommodate everyone in the class.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What should I wear to class?</h3>
                <p className="text-muted-foreground">Wear comfortable clothing that allows you to move freely. Athletic wear or loose-fitting clothes work great. Bring water and a towel, and wear shoes with good grip.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How far in advance can I book?</h3>
                <p className="text-muted-foreground">You can book classes up to 2 weeks in advance. This ensures fair access for all students and helps maintain manageable class sizes.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">What is your cancellation policy?</h3>
                <p className="text-muted-foreground">We offer full refunds for cancellations made at least 24 hours before the class. For cancellations within 24 hours, we offer class credits for future use.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer private lessons?</h3>
                <p className="text-muted-foreground">Yes! Luna offers private and semi-private lessons for those who want personalized attention or are preparing for special events. Contact us for pricing and availability.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Is parking available?</h3>
                <p className="text-muted-foreground">There are several public parking options near the studio, including street parking and nearby car parks. The studio is also easily accessible by public transport.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
