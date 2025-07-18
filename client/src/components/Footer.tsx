import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Footer() {


  const { user, isAuthenticated } = useAuth();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/">
              <img
                  src="/uploads/ee2acde843249d712c34635a13c771b7"
                  alt="Logo Image"
                  className="h-48 w-72"
              />
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Transform your creativity into custom products with our advanced DTF printing, 
              laser engraving, and vinyl cutting services. Join our artist community and 
              start selling your designs today.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:support@artcraftstudio.com" 
                className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            { isAuthenticated && (
              <>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <Link href="/shop">
                      <span className="hover:text-primary transition-colors cursor-pointer">Shop</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/artists">
                      <span className="hover:text-primary transition-colors cursor-pointer">Artists</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/designs">
                      <span className="hover:text-primary transition-colors cursor-pointer">Artists Gallery</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/create">
                      <span className="hover:text-primary transition-colors cursor-pointer">Customize Product</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/become-an-artist">
                      <span className="hover:text-primary transition-colors cursor-pointer">Become An Artist</span>
                    </Link>
                  </li>
                  
                </ul>
              </>
            )}
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/faqs" className="hover:text-primary transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/gift-ideas" className="hover:text-primary transition-colors">
                  Gift Ideas
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="hover:text-primary transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="/custom-quotes" className="hover:text-primary transition-colors">
                  Custom Quotes
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 ArtCraft Studio. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="/privacy-policy" 
              className="text-gray-400 hover:text-primary text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-&-condition" 
              className="text-gray-400 hover:text-primary text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
