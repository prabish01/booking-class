import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Award, Heart, Users, Star, Music, Sparkles, Globe } from "lucide-react";

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
      <section className="py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Meet <span className="text-gradient">Luna Shree</span>
              </h1>

              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Welcome to my world of dance! I&apos;m Luna Shree, a passionate <span className="font-semibold text-saffron">Bollywood and fusion dance instructor</span> based in Glasgow, Scotland.
                </p>
                <p>
                  My journey with dance began over <span className="font-semibold text-bollywood-pink">10 years ago</span>, and it has been an incredible adventure of self-discovery, cultural expression, and community building.
                </p>
                <p>
                  Through movement, I share the <span className="font-semibold text-gradient">vibrant stories of Indian culture</span>, creating a space where tradition meets contemporary expression.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/classes">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-gradient-to-r from-saffron to-bollywood-pink hover:from-saffron/90 hover:to-bollywood-pink/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Heart className="w-5 h-5 mr-2" />
                    Book a Class
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 border-2 border-saffron text-saffron hover:bg-saffron hover:text-white transform hover:scale-105 transition-all duration-300">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-saffron to-bollywood-pink rounded-3xl shadow-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Music className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-2xl font-bold">Luna Shree</div>
                    <div className="text-lg opacity-90">Dance Instructor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Achievements & <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">A decade of dedication, passion, and countless moments of joy shared through dance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:scale-105 hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <achievement.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{achievement.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50/30 to-pink-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                My <span className="text-gradient">Dance Journey</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">From childhood dreams to cultural ambassador—discover the story behind the passion</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">The Beginning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-center">Dance has always been more than just movement for me—it&apos;s a language of emotion, a bridge between cultures, and a celebration of life itself.</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Finding My Purpose</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-center">After moving to Glasgow, I realized there was a beautiful opportunity to share this rich cultural tradition with a diverse community.</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Teaching Philosophy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-center">Every class I teach is infused with the belief that dance is for everyone, designed to challenge, inspire, and bring joy.</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Living the Dance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-center">Dance isn&apos;t just what I do—it&apos;s who I am. From choreographing to performing at cultural events across Scotland.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              Ready to Dance with <span className="text-gradient">Luna</span>?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">Join me for an unforgettable dance experience. Let&apos;s move, groove, and create beautiful memories together.</p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link href="/classes">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-gradient-to-r from-saffron to-bollywood-pink hover:from-saffron/90 hover:to-bollywood-pink/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  View Classes
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-2 border-saffron text-saffron hover:bg-saffron hover:text-white transform hover:scale-105 transition-all duration-300">
                  Get in Touch
                </Button>
              </Link>
            </div>

            <div className="flex justify-center items-center space-x-8 text-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-saffron">10+</div>
                <div className="text-sm">Years Experience</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bollywood-pink">500+</div>
                <div className="text-sm">Happy Students</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-saffron">100%</div>
                <div className="text-sm">Cultural Authenticity</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
