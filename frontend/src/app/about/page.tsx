import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Award, Heart, Users, Star } from "lucide-react";

export default function About() {
  const achievements = [
    {
      icon: Award,
      title: "10+ Years Experience",
      description: "Over a decade of teaching Bollywood and fusion dance",
    },
    {
      icon: Users,
      title: "500+ Students",
      description: "Taught hundreds of students across all skill levels",
    },
    {
      icon: Heart,
      title: "Cultural Ambassador",
      description: "Sharing the beauty of Indian culture through dance",
    },
    {
      icon: Star,
      title: "Performance Artist",
      description: "Regular performances at cultural events and festivals",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-bollywood-pink/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet <span className="text-gradient">Luna Shree</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                Welcome to my world of dance! I&apos;m Luna Shree, a passionate Bollywood and fusion dance instructor based in Glasgow, Scotland. My journey with dance began over 10 years ago, and it has been an incredible adventure of self-discovery, cultural expression, and community building.
              </p>
              <Link href="/classes">
                <Button size="lg" className="text-lg px-8">
                  Book a Class with Luna
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-saffron to-bollywood-pink rounded-3xl shadow-2xl">
                {/* Placeholder for Luna's photo */}
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold rounded-3xl bg-black/20">Luna&apos;s Professional Photo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              My <span className="text-gradient">Dance Journey</span>
            </h2>

            <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
              <p>Dance has always been more than just movement for me—it&apos;s a language of emotion, a bridge between cultures, and a celebration of life itself. My journey began in childhood, where I was mesmerized by the vibrant choreography and expressive storytelling of Bollywood films.</p>

              <p>
                After moving to Glasgow, I realized there was a beautiful opportunity to share this rich cultural tradition with a diverse community. What started as informal dance sessions with friends has blossomed into Masala Moves—a space where people from all backgrounds come together to
                experience the joy of Bollywood and fusion dance.
              </p>

              <p>Every class I teach is infused with the belief that dance is for everyone. Whether you&apos;re taking your first steps or you&apos;re an experienced dancer looking to explore new styles, my classes are designed to challenge, inspire, and most importantly, bring joy.</p>

              <p>When I&apos;m not teaching, you&apos;ll find me choreographing new routines, performing at cultural events across Scotland, or simply dancing in my living room to the latest Bollywood hits. Dance isn&apos;t just what I do—it&apos;s who I am.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Achievements & <span className="text-gradient">Experience</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <achievement.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{achievement.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              My Teaching <span className="text-gradient">Philosophy</span>
            </h2>

            <blockquote className="text-2xl italic text-muted-foreground mb-8 leading-relaxed">
              &quot;Dance is the hidden language of the soul. Every step tells a story, every movement carries emotion, and every class is an opportunity to connect—with yourself, with others, and with the beautiful tapestry of culture that dance represents.&quot;
            </blockquote>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-primary">Inclusivity</h3>
                <p className="text-muted-foreground">Every body, every background, every skill level is welcome in my classes. Dance is for everyone.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-primary">Authenticity</h3>
                <p className="text-muted-foreground">I teach not just the moves, but the cultural context and emotional expression behind each dance style.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-primary">Joy</h3>
                <p className="text-muted-foreground">Above all, dance should bring happiness. My classes are designed to be fun, energetic, and uplifting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Dance with Luna?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">Join me for an unforgettable dance experience. Let&apos;s move, groove, and create beautiful memories together.</p>
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
