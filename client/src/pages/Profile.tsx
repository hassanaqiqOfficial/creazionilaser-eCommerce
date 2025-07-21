import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User,Truck, Package, Palette, Upload, Eye } from "lucide-react";
import e from "express";

export default function Profile() {
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [isUpdatingArtist, setIsUpdatingArtist] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { data : artist} = useQuery({
    queryKey: ["/api/artists/me"],
    enabled: isAuthenticated,
  });

  const [activeTab, setActiveTab] = !artist ? useState("profile") : useState('artist');

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  //const [firstName,setFirstName] = useState(artist?.firstName);

  console.log(artist);
  
  const [formData,setFormData] = useState({
    userId : artist?.userId,
    firstName : artist?.firstName,
    lastName : artist?.lastName  || "",
    email : artist?.email,
    bio : artist?.biography,
    specialty : artist?.specialty,
    imageUrl : artist?.imageUrl,
    website : artist?.socialLinks.website ,
    instagram : artist?.socialLinks.instagram ,
  });
  
  const { data: designs = [] } = useQuery({
    queryKey: ["/api/designs", artist?.artistId],
    queryFn: async () => {
      if (!artist?.artistId) return [];
      const response = await fetch(`/api/designs?artist=${artist?.artistId}`);
      return response.json();
    },
    enabled: !!artist?.artistId,
  });

  const updateArtistMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/artists/${artist?.artistId}`,{
          method: "PUT",
          body: data,
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to update artist profile");
        return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Artist profile updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/artists/me"] });
      setIsUpdatingArtist(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadDesignMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/designs", {
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
        description: "Design uploaded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/designs"] });
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateArtist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadedFile) return;
    const formData = new FormData(e.currentTarget);
    formData.append("image", uploadedFile);
    updateArtistMutation.mutate(formData);
  };

  const handleUploadDesign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData(e.currentTarget);
    formData.append("image", selectedFile);
    uploadDesignMutation.mutate(formData);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to access your profile.
            </p>
            <Button onClick={() => window.location.href = "/api/login"}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex">
          
          {!artist ? (

            <TabsList className="grid h-full w-72 mr-4 grid-cols-1">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile 
                </TabsTrigger>
                <TabsTrigger  value="shipping">
                  <Truck className="h-4 w-4 mr-2" />
                  Shipping 
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="h-4 w-4 mr-2" />
                  My Orders
                </TabsTrigger>
            </TabsList>

            ) : (

            <TabsList className="grid h-full w-72 mr-4 grid-cols-1">
                <TabsTrigger value="artist">
                  <Palette className="h-4 w-4 mr-2" />
                  Artist Profile
                </TabsTrigger>
                <TabsTrigger value="designs" disabled={!artist}>
                  <Eye className="h-4 w-4 mr-2" />
                  My Designs
                </TabsTrigger>  
            </TabsList>
            
          )}
         
          {!artist ? (

            <>
              <TabsContent value="profile" className="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={user?.firstName || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={user?.lastName || ""}
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Account information is managed through your Replit account.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600">Your order history will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order: any) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">Order #{order.orderNumber}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${order.totalAmount}</p>
                                <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600">Your order history will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order: any) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">Order #{order.orderNumber}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${order.totalAmount}</p>
                                <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent> 

            </>  
        
            )
            :
            
            (

            <>

              <TabsContent value="artist" className="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Artist Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                      <div>
                        <form onSubmit={handleUpdateArtist} className="space-y-4">

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                type="hidden"
                                name="userId"
                                value={formData.userId}
                                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                              />
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="First Name"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Last Name"
                                required
                              />
                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="User Email"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="specialty">Specialty</Label>
                              <Input
                                id="specialty"
                                type="text"
                                name="specialty"
                                value={formData.specialty}
                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                placeholder="e.g., Digital Illustration, Typography"
                                required
                              />
                            </div>

                          </div>

                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              type="textarea"
                              name="bio"
                              value={formData.bio}
                              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                              placeholder="Tell us about yourself and your art..."
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="image-url">Upload Profile Image</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <input
                                name="existingProfileImage"
                                type="hidden"
                                className="hidden"
                                value={formData.imageUrl}
                              />
                              <input
                                id="image-url"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                              />
                              <img 
                              src={formData.imageUrl}
                              alt="Existing Profile Image" 
                              className="h-16 w-16" />
                              <label htmlFor="image-url" className="cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">
                                  {uploadedFile ? uploadedFile.name : "Click to upload design"}
                                </p>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="website">Website (Optional)</Label>
                              <Input
                                id="website"
                                name="website"
                                type="text"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website : e.target.value })}
                                placeholder="www.google.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="instagram">Instagram (Optional)</Label>
                              <Input
                                id="instagram"
                                name="instagram"
                                type="text"
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram : e.target.value })}
                                placeholder="@yourusername"
                              />
                            </div>
                          </div>

                          <div className="flex space-x-4 justify-end items-end">
                            <Button 
                              type="submit" 
                              disabled={updateArtistMutation.isPending}
                            >
                              {updateArtistMutation.isPending ? "Updating..." : "Update Profile"}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setIsUpdatingArtist(false)}
                            >
                              Cancel
                            </Button>
                          </div>

                        </form>

                      </div>

                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="designs" className="w-full">
                <div className="space-y-6">
                  {/* Upload New Design */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload New Design</CardTitle>
                    </CardHeader>
                    <CardContent>

                      <form onSubmit={handleUploadDesign} className="space-y-4">
                        
                        <div>
                          <Label htmlFor="design-title">Title</Label>
                          <Input
                            id="design-title"
                            name="title"
                            placeholder="Enter design title"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="design-description">Description</Label>
                          <Textarea
                            id="design-description"
                            name="description"
                            placeholder="Describe your design..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="design-price">Price ($)</Label>
                          <Input
                            id="design-price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="design-file">Design File</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              id="design-file"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                              required
                            />
                            <label htmlFor="design-file" className="cursor-pointer">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                              <p className="text-gray-600">
                                {selectedFile ? selectedFile.name : "Click to upload design"}
                              </p>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex space-x-4 justify-end items-end">

                          <Button 
                            type="submit" 
                            disabled={uploadDesignMutation.isPending || !selectedFile}
                          >
                            {uploadDesignMutation.isPending ? "Uploading..." : "Upload Design"}
                          </Button>
                        
                        </div>
                      
                      </form>

                    </CardContent>
                  </Card>

                  {/* My Designs */}
                  <Card>
                    <CardHeader>
                      <CardTitle>My Designs ({designs.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {designs.length === 0 ? (
                        <div className="text-center py-8">
                          <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No designs yet</h3>
                          <p className="text-gray-600">Upload your first design to get started</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                          {designs.map((design: any) => (
                            <div key={design.id} className="border rounded-lg overflow-hidden">
                              <img
                                src={design.imageUrl}
                                alt={design.title}
                                className="w-full h-32 object-cover"
                              />
                              <div className="p-3 flex justify-between">
                                <h4 className="font-medium">{design.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {design.downloadCount} downloads
                                </p>   
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>  

            </>
          
          )} 

      </Tabs>
    </div>
  );
}
