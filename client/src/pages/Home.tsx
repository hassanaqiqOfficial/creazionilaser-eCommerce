import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Star, ArrowRight, Users, Palette, ShoppingBag, Zap } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ArtistCard from "@/components/ArtistCard";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();


  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: artists = [] } = useQuery({
    queryKey: ["/api/artists"],
  });

  const { data: artist } = useQuery({
    queryKey: ["/api/artists/me"],
    enabled: isAuthenticated,
  });
  
  const featuredProducts = products.slice(0, 4);
  const featuredArtists = artists.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Custom Products, <span className="text-accent">Endless Creativity</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Transform your ideas into unique products with our DTF printing, laser engraving, 
                and vinyl cutting services. Join thousands of artists and creators in our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  onClick={() => setLocation("/create")}
                >
                  Create Your Product
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white text-gray-900"
                  onClick={() => setLocation("/artists")}
                >
                  Discover Artists
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&w=800&h=600&fit=crop" 
                alt="Custom product creation workspace" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Choose from our wide range of customizable products</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-stagger">
            {categories.map((category: any) => (
              <Card 
                key={category.id} 
                className="group cursor-pointer card-hover"
                onClick={() => setLocation(`/shop?category=${category.slug}`)}
              >
                <CardContent className="p-6 text-center">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">Browse designs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">From design to delivery in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-stagger">
            {[
              { step: 1, title: "Choose Product", desc: "Select from our wide range of customizable products", icon: ShoppingBag, color: "bg-primary" },
              { step: 2, title: "Customize Design", desc: "Upload your artwork or choose from our artist gallery", icon: Palette, color: "bg-secondary" },
              { step: 3, title: "Preview & Order", desc: "See exactly how your product will look before ordering", icon: Zap, color: "bg-accent" },
              { step: 4, title: "Fast Delivery", desc: "Receive your custom product in 3-7 business days", icon: Users, color: "bg-green-500" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`${item.color} text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { icon: "🖨️", title: "DTF Printing", desc: "Direct-to-Film printing for vibrant, durable designs on fabric" },
                { icon: "✂️", title: "Laser Engraving", desc: "Precision laser cutting and engraving for wood, metal, and acrylic" },
                { icon: "📋", title: "Vinyl Cutting", desc: "High-quality vinyl cutting for stickers, decals, and labels" },
              ].map((service) => (
                <div key={service.title} className="text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Artists</h2>
            <p className="text-xl text-gray-600">Discover amazing artwork from our creative community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-stagger">
            {featuredArtists.map((artist: any, index: number) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setLocation("/artists")}
              className="bg-primary hover:bg-primary/90"
            >
              View All Artists
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of happy customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-stagger">
            {[
              {
                text: "The quality exceeded my expectations! My custom t-shirts turned out exactly as I envisioned. The DTF printing is incredibly durable and vibrant.",
                name: "David Johnson",
                title: "Small Business Owner",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
              },
              {
                text: "As an artist, I love how easy it is to sell my designs here. The platform takes care of everything while I focus on creating. Great commission rates too!",
                name: "Lisa Rodriguez", 
                title: "Digital Artist",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b123?w=64&h=64&fit=crop&crop=face"
              },
              {
                text: "Perfect for corporate gifts! We ordered custom wooden plaques for our employees and they were beautifully laser engraved. Fast delivery too.",
                name: "Amanda Chen",
                title: "HR Manager", 
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Something Amazing?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of creators and bring your ideas to life with professional-quality custom products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              onClick={() => setLocation("/create")}
            >
              Start Designing Now
            </Button>
            {!artist &&(
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white text-gray-900"
                onClick={() => setLocation("/become-an-artist")}
              >
                Become an Artist
              </Button>
            )}
            
          </div>
        </div>
      </section>
      
    </div>
  );
}
