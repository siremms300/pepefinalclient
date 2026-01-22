// components/layout/Footer
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-pepe-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-pepe-primary rounded-full flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">P</span>
              </div>
              <span className="font-display font-bold text-2xl">
                Pepe&apos;s <span className="text-pepe-primary">Brunch</span>
              </span>
            </div>
            <p className="text-gray-400">
              Delivering delicious brunch and cafe items straight to your doorstep since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-pepe-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-pepe-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-pepe-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-pepe-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-pepe-primary" />
                <span className="text-gray-400">No 3, El Gibbon Plaza, Opposite Barnawa Market, Kaduna</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-pepe-primary" />
                <span className="text-gray-400">+234 (80) 6500-9423</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-pepe-primary" />
                <span className="text-gray-400">pepesbrunchandcafe@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pepe-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pepe-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pepe-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 mt-4">
              Subscribe to our newsletter for updates
            </p>
            <form className="mt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg flex-1 text-pepe-dark"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-pepe-primary rounded-r-lg hover:bg-pink-500 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pepe&apos;s Brunch and Cafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}