"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, Heart, Sparkles, Music } from "lucide-react";

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
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-bollywood-pink/5 to-cream/20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-primary/20">
            <Heart className="h-8 w-8 animate-pulse" />
          </div>
          <div className="absolute top-20 right-20 text-bollywood-pink/30">
            <Sparkles className="h-6 w-6 animate-bounce delay-300" />
          </div>
          <div className="absolute bottom-20 left-20 text-primary/25">
            <Music className="h-10 w-10 animate-pulse delay-500" />
          </div>
          <div className="absolute bottom-10 right-10 text-bollywood-pink/20">
            <Sparkles className="h-8 w-8 animate-bounce" />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Let&apos;s Connect</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            <span className="text-gradient">Get in Touch</span>
            <br />
            <span className="text-2xl md:text-3xl font-normal text-muted-foreground">with Luna Shree</span>
          </h1>

          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-xl text-muted-foreground mb-6">Ready to embark on your Bollywood dance journey? Whether you&apos;re a complete beginner or looking to perfect your moves, Luna is here to guide you every step of the way.</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Professional Instruction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-bollywood-pink rounded-full animate-pulse delay-200"></div>
                <span>All Skill Levels Welcome</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-400"></div>
                <span>Personalized Approach</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-bollywood-pink/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    Contact Information
                  </CardTitle>
                  <CardDescription>Connect with Luna Shree&apos;s Dance Studio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="group hover:bg-white/50 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Studio Location</h3>
                        <div className="text-muted-foreground space-y-1">
                          <p className="font-medium">Luna Shree Dance Studio</p>
                          <p>123 Sauchiehall Street</p>
                          <p>Glasgow, G2 3EW</p>
                          <p>Scotland</p>
                        </div>
                        <div className="mt-2 text-xs text-primary/80">📍 City Center Location • Easy Public Transport Access</div>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-white/50 p-4 rounded-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-bollywood-pink/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-bollywood-pink/20 transition-colors">
                        <Mail className="h-6 w-6 text-bollywood-pink" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-bollywood-pink">Email</h3>
                        <a href="mailto:hello@masalamoves.com" className="text-muted-foreground hover:text-bollywood-pink transition-colors">
                          hello@masalamoves.com
                        </a>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-muted-foreground">Usually responds within 2-4 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-white/50 p-4 rounded-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Phone</h3>
                        <a href="tel:+441234567890" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                          +44 123 456 7890
                        </a>
                        <p className="text-xs text-muted-foreground mt-2">📞 Available Mon-Fri, 9AM-6PM GMT</p>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-white/50 p-4 rounded-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-bollywood-pink/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-bollywood-pink/20 transition-colors">
                        <Clock className="h-6 w-6 text-bollywood-pink" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-bollywood-pink">Studio Hours</h3>
                        <div className="text-muted-foreground space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Monday - Friday</span>
                            <span className="text-sm font-medium">6:00 PM - 10:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Saturday</span>
                            <span className="text-sm font-medium">10:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Sunday</span>
                            <span className="text-sm font-medium">2:00 PM - 6:00 PM</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-bollywood-pink/80">⏰ Private sessions available by appointment</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-bollywood-pink/5 to-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-bollywood-pink/20 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-bollywood-pink" />
                    </div>
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Ready to dance? Here are some quick ways to get started with Luna&apos;s classes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10 hover:border-primary/20 group transition-all duration-300" asChild>
                    <Link href="/classes">
                      <Music className="h-4 w-4 mr-3 text-primary group-hover:animate-pulse" />
                      View Class Schedule
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-bollywood-pink/10 hover:border-bollywood-pink/20 group transition-all duration-300" asChild>
                    <Link href="/about">
                      <Heart className="h-4 w-4 mr-3 text-bollywood-pink group-hover:animate-pulse" />
                      About Luna Shree
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10 hover:border-primary/20 group transition-all duration-300" asChild>
                    <a href="tel:+441234567890">
                      <Phone className="h-4 w-4 mr-3 text-primary group-hover:animate-bounce" />
                      Call Directly
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-bollywood-pink/10 hover:border-bollywood-pink/20 group transition-all duration-300" asChild>
                    <a href="mailto:hello@masalamoves.com">
                      <Send className="h-4 w-4 mr-3 text-bollywood-pink group-hover:animate-pulse" />
                      Send Email
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-cream/20 to-primary/5">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-bollywood-pink rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription className="text-base">Whether you&apos;re interested in joining a class, booking a private session, or just have questions about Bollywood dance, Luna would love to hear from you!</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-16">
                      <div className="relative">
                        <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-500 animate-bounce" />
                        <div className="absolute inset-0 animate-ping">
                          <CheckCircle className="h-20 w-20 mx-auto text-green-300 opacity-30" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-gradient">Message Sent! 🎉</h3>
                      <p className="text-lg text-muted-foreground mb-4">Thank you for reaching out to Luna Shree&apos;s Dance Studio!</p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-green-800">✨ We&apos;ll get back to you within 2-4 hours during business hours</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-primary flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                              Full Name *
                            </Label>
                            <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="Your full name" className="h-12 focus:ring-2 focus:ring-primary/20 border-2 transition-all duration-300" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                              Email Address *
                            </Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="your.email@example.com" className="h-12 focus:ring-2 focus:ring-bollywood-pink/20 border-2 transition-all duration-300" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">
                              Phone Number
                            </Label>
                            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+44 123 456 7890" className="h-12 focus:ring-2 focus:ring-primary/20 border-2 transition-all duration-300" />
                            <p className="text-xs text-muted-foreground">Optional - for faster response</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject" className="text-sm font-medium">
                              Subject *
                            </Label>
                            <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleInputChange} required placeholder="e.g., Beginner Class Inquiry" className="h-12 focus:ring-2 focus:ring-bollywood-pink/20 border-2 transition-all duration-300" />
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-bollywood-pink flex items-center gap-2">
                          <Music className="h-5 w-5" />
                          Your Message
                        </h4>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-medium">
                            Tell us about your dance journey *
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            placeholder="Share your experience level, what you'd like to learn, any specific questions about classes, or let us know if you're interested in private sessions..."
                            rows={8}
                            className="resize-none focus:ring-2 focus:ring-primary/20 border-2 transition-all duration-300"
                          />
                          <p className="text-xs text-muted-foreground">💫 The more you tell us, the better we can help you on your dance journey!</p>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6">
                        <div className="text-sm text-muted-foreground">
                          <p>✨ All fields marked with * are required</p>
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto min-w-[200px] h-12 bg-gradient-to-r from-primary to-bollywood-pink hover:from-primary/90 hover:to-bollywood-pink/90 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-3" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-cream/50 via-primary/5 to-bollywood-pink/10 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-primary/10">
            <Music className="h-16 w-16 animate-pulse" />
          </div>
          <div className="absolute bottom-20 right-10 text-bollywood-pink/10">
            <Heart className="h-20 w-20 animate-bounce delay-300" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-sm">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-medium text-primary">Common Questions</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Everything you need to know about starting your Bollywood dance journey with Luna Shree. Can&apos;t find what you&apos;re looking for? We&apos;re just a message away!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-primary">Do I need prior dance experience?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Absolutely not! 💫 Luna&apos;s classes welcome dancers of all levels - from those who&apos;ve never danced before to experienced performers. Luna&apos;s teaching approach adapts to each student, ensuring everyone feels comfortable and progresses at their own pace.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-bollywood-pink/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-bollywood-pink/20 transition-colors">
                      <Sparkles className="h-5 w-5 text-bollywood-pink" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-bollywood-pink">What should I wear to class?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Comfort is key! 👗 Wear breathable, stretchy clothing that allows free movement - think athletic wear, loose pants, or comfortable skirts. Bring water, a towel, and wear shoes with good grip. Many students love wearing colorful outfits to match the vibrant Bollywood spirit!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Music className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-primary">How far in advance can I book?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        You can book classes up to 2 weeks in advance through our online booking system. 📅 This helps ensure fair access for all students and maintains optimal class sizes for the best learning experience. Popular time slots fill up quickly!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-bollywood-pink/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-bollywood-pink/20 transition-colors">
                      <CheckCircle className="h-5 w-5 text-bollywood-pink" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-bollywood-pink">What is your cancellation policy?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We understand life happens! 🔄 Full refunds are available for cancellations made at least 24 hours before class. For shorter notice cancellations, we offer class credits that can be used for future sessions - because we want you to dance when it&apos;s right for you!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-primary">Do you offer private lessons?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Yes! ✨ Luna offers private and semi-private lessons perfect for personalized attention, wedding choreography, special events, or if you prefer one-on-one instruction. These sessions can be tailored to your specific goals and schedule.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-bollywood-pink/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-bollywood-pink/20 transition-colors">
                      <MapPin className="h-5 w-5 text-bollywood-pink" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-bollywood-pink">How do I get to the studio?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Located in the heart of Glasgow city center! 🚇 The studio is easily accessible by public transport with several bus stops nearby. Street parking and public car parks are available within walking distance. Full directions will be sent with your booking confirmation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
