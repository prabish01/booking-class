import Link from "next/link";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#fff5e6] via-[#fff0f5] to-[#fff5e6] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,117,76,0.05)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-saffron/[0.03] via-transparent to-bollywood-pink/[0.03]"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-saffron to-bollywood-pink rounded-2xl flex items-center justify-center transform rotate-6 shadow-lg">
                <span className="text-white font-bold text-xl transform -rotate-6">M</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-saffron to-bollywood-pink bg-clip-text text-transparent">Masala Moves</span>
            </div>
            <p className="text-gray-600 leading-relaxed">Connecting cultures through dance. Experience the joy of Bollywood fusion with Luna Shree in Glasgow.</p>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-saffron to-bollywood-pink bg-clip-text text-transparent">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-bollywood-pink transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/classes" className="text-gray-600 hover:text-bollywood-pink transition-colors duration-300">
                  Classes
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-bollywood-pink transition-colors duration-300">
                  About Luna
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-bollywood-pink transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-saffron to-bollywood-pink bg-clip-text text-transparent">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600 hover:text-bollywood-pink transition-colors duration-300 group">
                <MapPin className="h-5 w-5 group-hover:text-saffron transition-colors duration-300" />
                <span>Glasgow, Scotland</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 hover:text-bollywood-pink transition-colors duration-300 group">
                <Mail className="h-5 w-5 group-hover:text-saffron transition-colors duration-300" />
                <span>hello@masalamoves.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 hover:text-bollywood-pink transition-colors duration-300 group">
                <Phone className="h-5 w-5 group-hover:text-saffron transition-colors duration-300" />
                <span>+44 123 456 7890</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-saffron to-bollywood-pink bg-clip-text text-transparent">Follow Us</h3>
            <div className="flex space-x-5">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron/10 to-bollywood-pink/10 flex items-center justify-center group hover:from-saffron hover:to-bollywood-pink transition-all duration-300" aria-label={social.label}>
                  <social.icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">Join our community and stay updated with the latest dance moves and classes.</p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-500">
            &copy; 2025 Masala Moves. All rights reserved. Created with
            <span className="mx-1 text-bollywood-pink">❤️</span>
            for the dance community.
          </p>
        </div>
      </div>
    </footer>
  );
}
