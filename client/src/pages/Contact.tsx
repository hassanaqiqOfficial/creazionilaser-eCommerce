import { useState } from "react";
import { useQuery,useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Card,CardWithShadow, CardContent,CardHeader, CardTitle  } from "@/components/ui/card";
import { Upload,Search, UserPlus,Star, ArrowRight,User, Users, Palette, ShoppingBag, Zap, ArrowDown } from "lucide-react";

import ArtistCard from "@/components/ArtistCard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation,Link } from "wouter";

export default function Contact() {

   const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [ setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string>("all");
  const [isCreatingEnquiry, setIsCreatingEnquiry] = useState(true);
  const [sortBy, setSortBy] = useState<string>("name");

  const [formData, setFormData] = useState({
    title: "",
    email: "",
    subject: "",
    message: "",
  });

  const { data: artists = [],isLoading } = useQuery({
    queryKey: ["/api/artists"],
  });

  const createEnquiryMutation = useMutation({
      
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
        setIsCreatingEnquiry(true);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
  });
  
  const handleEnquiryQuote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createEnquiryMutation.mutate(formData);
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
          <div className="mb-16 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Discover our wide range of elegant artworks by huge number of artists,we have showcased every artist artwork with an equal opportunity.
            </p>
          </div>

      </div>

      <section className="py-16 bg-gray-50">      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Become our section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="py-16 space-y-6 inline-block">
                  
                  <div className="">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Need to enquire?</h1>
                    <p className="text-xl text-gray-600">Need to enquire for any kind of purpose or for problem you may face using this platform feel free to reach out to us one of our representative will reach out to you as soon as possible.Experience our widest artwork eCommerce marketplace by simply filling this for to become a verified Artist.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type</p>
                  </div>
              
              </div>

              {/* Customization Panel */}
              <div className="space-y-6">
                <CardWithShadow>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      Enquire Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Artwork Type Selection */}
    
                    <form onSubmit={handleEnquiryQuote} className="space-y-4">
    
                      <div>
                        <Label htmlFor="title">Fullname</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Fullname"
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
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Start typing your message here..."
                          required
                        />
                      </div>
    
                      <div className="flex space-x-4 justify-end">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsCreatingEnquiry(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createEnquiryMutation.isPending}
                        >
                          {createEnquiryMutation.isPending ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
    
                    </form>
                    
                  </CardContent>
                </CardWithShadow>
              </div>
              
            </div>
        </div>      
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
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

    </>

  );

}
