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
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet <span className="text-gradient">Luna Shree</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                With over 10 years of experience in Bollywood and fusion dance, Luna brings passion, energy, and authenticity to every class. Based in Glasgow, she has created a welcoming space where students can explore the rich tradition of Indian dance while expressing their own creativity.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">From traditional Bollywood choreography to modern fusion styles, Luna&apos;s classes are designed to challenge and inspire dancers of all levels.</p>
              <Link href="/about">
                <Button size="lg" className="text-lg px-8">
                  Learn More About Luna
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-saffron to-bollywood-pink rounded-3xl shadow-2xl">
                {/* Placeholder for Luna's photo */}
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold rounded-3xl bg-black/20">Luna&apos;s Photo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Dancing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">Join our vibrant community and discover the joy of Bollywood dance. Book your first class today and feel the rhythm!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/classes">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                View Classes
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
