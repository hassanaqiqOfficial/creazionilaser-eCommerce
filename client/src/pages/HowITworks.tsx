import { useState } from "react";
import { useQuery,useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload,Search, UserPlus,Star, ArrowRight,User, Users, Palette, ShoppingBag, Zap, ArrowDown } from "lucide-react";

import ArtistCard from "@/components/ArtistCard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation,Link } from "wouter";

export default function HowITworks() {

    const { isAuthenticated } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isCreatingArtist, setIsCreatingArtist] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [bio, setBio] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [instagram, setInstagram] = useState("");
    const [website, setWebsite] = useState("");

    const { data: artist } = useQuery({
      queryKey: ["/api/artists/me"],
      enabled: isAuthenticated,
    });
    
    const { data: artists = [], isLoading } = useQuery({
      queryKey: ["/api/artists"],
    });

    const createArtistMutation = useMutation({
      
      mutationFn: async (formData: any) => {
       
        const response = await fetch("/api/artists", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to upload design");
        return response.json();
      },
    
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Artist profile created successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/artists/me"] });
        setIsCreatingArtist(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  
    const handleCreateArtist = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!uploadedFile) return;
      const formData = new FormData(e.currentTarget);
      formData.append("image", uploadedFile);
      createArtistMutation.mutate(formData);

    };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
     {/* Header */}

      <div className="mb-16 mt-6">
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          ArtCraftStudio is a leading white lable print on demand services provider eCommerce platform with "Premier Online Gallery," "Emerging Art Marketplace," &amp; "Handcrafted Art Platform". We’re passionate about supporting talented artists like you by providing a platform to showcase and sell your work to a wider audience.
          We’d love to explore a collaboration where we feature your artwork on our platform, handling marketing, sales, and logistics while you focus on creating. Here’s what we offer:
        </p>
        <h3 className="text-2xl md:text-2xl font-bold text-gray-900 mb-4">Why Choose ArtCraftStudio?</h3>
        <p className="text-lg text-gray-600 mb-8">ArtCraftStudio is a leading white lable print on demand services provider eCommerce platform with "Premier Online Gallery," "Emerging Art Marketplace," &amp; "Handcrafted Art Platform". We’re passionate about supporting talented artists like you by providing a platform to showcase and sell your work to a wider audience.
          We’d love to explore a collaboration where we feature your artwork on our platform, handling marketing, sales, and logistics while you focus on creating. Here’s what we offer:</p>
          
      </div>

    </div>

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

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-12">
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Share Your Artwork?</h2>
        <p className="text-lg text-blue-100 mb-6">
          Join our community of artists and start earning from your creativity
        </p>
        
        <div className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">30%</div>
              <div className="text-sm text-blue-100">Commission Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-blue-100">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Free</div>
              <div className="text-sm text-blue-100">To Join</div>
            </div>
          </div>
          
          {isAuthenticated && !artist ? (
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-gray-900 hover:bg-white hover:text-primary"
              onClick={() => setIsCreatingArtist(true)}
            >
              Get Started Now
            </Button>
          ) : !isAuthenticated ? ( 
            <Link href="/signup">
              <Button size="lg" className="mt-4 min-w-[200px]">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
           ) : ('')}
        </div>

      </div>
      
    </div>

    </>
    

  );

}
