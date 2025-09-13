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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">Masala Moves</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Experience the perfect blend of traditional Bollywood and modern fusion dance in a welcoming and energetic environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border border-primary/10 bg-white/50 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300 group">
                <CardHeader>
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center mb-6">
                    <feature.icon className="h-10 w-10 text-white transform -rotate-3 group-hover:-rotate-6 transition-transform" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-saffron to-bollywood-pink bg-clip-text text-transparent">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Meet{" "}
                  <span className="text-gradient relative">
                    Luna Shree
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-saffron to-bollywood-pink transform scale-x-100"></span>
                  </span>
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-xl text-gray-600 leading-relaxed">
                  With over 10 years of experience in Bollywood and fusion dance, Luna brings passion, energy, and authenticity to every class. Based in Glasgow, she has created a welcoming space where students can explore the rich tradition of Indian dance while expressing their own creativity.
                </p>
                <p className="text-xl text-gray-600 leading-relaxed">From traditional Bollywood choreography to modern fusion styles, Luna&apos;s classes are designed to challenge and inspire dancers of all levels.</p>
              </div>
              <div className="pt-4">
                <Link href="/about">
                  <Button size="lg" className="text-lg px-10 h-14 bg-black text-white hover:bg-gray-900 transition-all duration-300">
                    Learn More About Luna
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron to-bollywood-pink rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden">
                {/* Placeholder for Luna's photo */}
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-light tracking-wide">Luna&apos;s Photo</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(249,168,212,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-saffron to-bollywood-pink bg-clip-text text-transparent">Ready to Start Dancing?</h2>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-600 leading-relaxed">Join our vibrant community and discover the joy of Bollywood dance. Book your first class today and feel the rhythm!</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/classes">
                <Button size="lg" className="text-lg min-w-[200px] h-14 bg-gradient-to-r from-saffron to-bollywood-pink text-white hover:from-bollywood-pink hover:to-saffron shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  View Classes
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg min-w-[200px] h-14 border-2 border-bollywood-pink text-bollywood-pink hover:bg-gradient-to-r hover:from-saffron hover:to-bollywood-pink hover:text-white hover:border-transparent transition-all duration-300 transform hover:-translate-y-0.5"
                >
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
