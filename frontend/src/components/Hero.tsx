"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline poster="/placeholder-hero.jpg">
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Video Controls */}
      <button onClick={toggleVideo} className="absolute bottom-4 right-4 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors" aria-label={isPlaying ? "Pause video" : "Play video"}>
        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
      </button>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className=" backdrop-blur-sm p-8 rounded-3xl ">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-saffron via-bollywood-pink to-bollywood-gold bg-clip-text text-transparent animate-gradient-x">Dance. Feel. Connect!</h1>

          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Join Luna Shree for authentic Bollywood fusion classes in Glasgow.
            <span className="block mt-2 text-saffron">Experience the joy of movement, the rhythm of culture, and the power of dance.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/classes">
              <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-saffron to-bollywood-pink hover:from-bollywood-pink hover:to-saffron transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Book Your Class
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-white text-white hover:bg-white/10 hover:border-saffron transition-all duration-300 backdrop-blur-sm">
                Meet Luna
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
