import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Palette, Shirt, Star, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">ArtistMarket</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Custom Products & Artist Community
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Create Custom Products with 
            <span className="text-blue-600"> Amazing Designs</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your ideas into reality with our custom printing services. 
            Browse unique designs from talented artists or upload your own creations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="min-w-[200px]">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Browse Designs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From custom t-shirts to laser-engraved items, we have all the tools and services you need.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Shirt className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Custom T-Shirts</CardTitle>
              <CardDescription>
                High-quality DTF printing on premium cotton tees
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Laser Engraving</CardTitle>
              <CardDescription>
                Precision engraving on wood, acrylic, and metal
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Palette className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Vinyl Stickers</CardTitle>
              <CardDescription>
                Durable, weatherproof vinyl decals and stickers
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Artist Community</CardTitle>
              <CardDescription>
                Discover and support talented artists worldwide
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Creating?
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg mb-8">
              Join thousands of creators and customers who trust us with their custom products.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white hover:text-blue-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Palette className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">ArtistMarket</span>
            </div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            © 2024 ArtistMarket. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}