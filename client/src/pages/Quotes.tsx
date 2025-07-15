import { useState } from "react";
import { useQuery,useMutation } from "@tanstack/react-query";
import { useLocation,Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card,CardWithShadow, CardContent,CardHeader, CardTitle  } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Search, Filter,Quote,User,Palette,ArrowDown,ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DesignCard from "@/components/DesignCard";

import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Quotes() {

  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [ setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string>("all");
  const [isCreatingCustomQuote, setIsCreatingCustomQuote] = useState(true);
  const [sortBy, setSortBy] = useState<string>("name");

  const [formData, setFormData] = useState({
    title: "",
    email: "",
    subject: "",
    description: "",
    socialLinks: {
      instagram: "",
      website: "",
    },
  });

  const { data: artists = [],isLoading } = useQuery({
    queryKey: ["/api/artists"],
  });

  const createCustomQuoteMutation = useMutation({
      
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
        setIsCreatingCustomQuote(true);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
  });
  
  const handleCreateCustomQuote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createCustomQuoteMutation.mutate(formData);
  };
 
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
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
        
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Custom Quotes
          </h1>

          {/* Top Introduction section */}
          <div className="mb-16 mx-auto">
            <h4 className="font-bold mb-4 md:text-2xl">Need To Order Bulk Products?</h4>
            <p className="text-lg text-gray-600 mb-8">
              ArtCraftStudio is a leading white lable print on demand services provider eCommerce platform with "Premier Online Gallery," "Emerging Art Marketplace," &amp; "Handcrafted Art Platform". We’re passionate about supporting talented artists like you by providing a platform to showcase and sell your work to a wider audience.
              We’d love to explore a collaboration where we feature your artwork on our platform, handling marketing, sales, and logistics while you focus on creating. Here’s what we offer:
            </p>
            <h6 className="font-bold mb-4 md:text-2xl text-2xl">Privillages For Companies/Special Events</h6>
            <ul className="mb-8">
              <li><b>Free Packaging : </b>We manage listings, promotions, payments, and shipping (if applicable).</li>
              <li><b>Bulk Order Discounts:</b>Tap into our growing community of art lovers and collectors.</li>
              <li><b>Express Delivery Service : </b>commission in your favor with fair competitive royalty rates.</li>
            </ul>

            {isAuthenticated && (
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setIsCreatingCustomQuote(true)}
              >
                  Want To Get Quote
                  <ArrowDown className="h-4 w-4 mr-2" />
              </Button>
            )}

          </div>

      </div>

      <section className="py-16 bg-gray-50">      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Become our section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Customization Panel */}
              
              { isCreatingCustomQuote && (
      
                <div className="space-y-6">
                  <CardWithShadow>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Palette className="h-5 w-5 mr-2" />
                        Get A Quote
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Artwork Type Selection */}
      
                      <form onSubmit={handleCreateCustomQuote} className="space-y-4">
      
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Title"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g., Google@gmail.com"
                            required
                          />
                        </div>
      
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="e.g., Subject"
                            required
                          />
                        </div>
      
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Tell us about your purpose of custom order..."
                            required
                          />
                        </div>
      
                        <div>
                          <Label htmlFor="website">Website (Optional)</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.socialLinks.website}
                            onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                            placeholder="https://google.com"
                          />
                        </div>
      
                        <div>
                          <Label htmlFor="instagram">Instagram (Optional)</Label>
                          <Input
                            id="instagram"
                            name="instagram"
                            value={formData.socialLinks.instagram}
                            onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                            placeholder="@yourusername"
                          />
                        </div>
      
                        <div className="flex space-x-4 justify-end">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsCreatingCustomQuote(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createCustomQuoteMutation.isPending}
                          >
                            {createCustomQuoteMutation.isPending ? "Submitting..." : "Submit"}
                          </Button>
                        </div>
      
                      </form>
                      
                    </CardContent>
                  </CardWithShadow>
                </div>
              )}
      
              {!isCreatingCustomQuote && ( <div className="py-16 space-y-6 inline-block"> </div> )}
              
              <div className="py-16 space-y-6 inline-block">
                  
                  <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Want To Get Custom Quote</h1>
                    <p className="text-xl text-gray-600">Experience our widest artwork eCommerce marketplace by simply filling this for to become a verified Artist.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type</p>
                  </div>
                
                {!isCreatingCustomQuote && (
                  <div className="text-center py-8">
                    <Button onClick={() => setIsCreatingCustomQuote(true)}>
                      <User className="h-4 w-4" />
                      Get Custom Quote
                    </Button>
                  </div>
                )} 
      
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
