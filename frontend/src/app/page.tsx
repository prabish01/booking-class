import Hero from "@/components/Hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Users, Award, Heart } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book classes up to 2 weeks in advance with easy online booking system.",
    },
    {
      icon: Users,
      title: "All Skill Levels",
      description: "Whether you're a beginner or experienced dancer, our classes welcome everyone.",
    },
    {
      icon: Award,
      title: "Professional Instruction",
      description: "Learn from Luna Shree, a passionate and experienced Bollywood dance instructor.",
    },
    {
      icon: Heart,
      title: "Cultural Connection",
      description: "Connect with Indian culture through the joy and expression of Bollywood dance.",
    },
  ];

  return (
    <div className="pt-0">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50/30 to-pink-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient">Masala Moves</span>?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">Experience the perfect blend of traditional Bollywood and modern fusion dance in a welcoming and energetic environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:scale-105 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Meet <span className="text-gradient">Luna Shree</span>
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  With over 10 years of experience in Bollywood and fusion dance, Luna brings passion, energy, and authenticity to every class. Based in Glasgow, she has created a welcoming space where students can explore the rich tradition of Indian dance while expressing their own creativity.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">From traditional Bollywood choreography to modern fusion styles, Luna&apos;s classes are designed to challenge and inspire dancers of all levels.</p>
              </div>
              <div className="pt-4">
                <Link href="/about">
                  <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-saffron to-bollywood-pink hover:from-saffron/90 hover:to-bollywood-pink/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Learn More About Luna
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-saffron to-bollywood-pink rounded-3xl shadow-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white text-xl font-medium">Luna&apos;s Photo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50/30 to-pink-50/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Ready to Start <span className="text-gradient">Dancing</span>?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">Join our vibrant community and discover the joy of Bollywood dance. Book your first class today and feel the rhythm!</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/classes">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-saffron to-bollywood-pink hover:from-saffron/90 hover:to-bollywood-pink/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  View Classes
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-saffron text-saffron hover:bg-saffron hover:text-white transform hover:scale-105 transition-all duration-300">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
