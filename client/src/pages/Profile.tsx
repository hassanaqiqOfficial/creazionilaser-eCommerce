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
import { User, Package, Palette, Upload, Eye } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isCreatingArtist, setIsCreatingArtist] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: artistProfile } = useQuery({
    queryKey: ["/api/artists/me"],
    enabled: isAuthenticated,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const { data: designs = [] } = useQuery({
    queryKey: ["/api/designs", artistProfile?.id],
    queryFn: async () => {
      if (!artistProfile?.id) return [];
      const response = await fetch(`/api/designs?artist=${artistProfile.id}`);
      return response.json();
    },
    enabled: !!artistProfile?.id,
  });

  const createArtistMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/artists", data);
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

  const handleCreateArtist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      bio: formData.get("bio"),
      specialty: formData.get("specialty"),
      socialLinks: {
        website: formData.get("website"),
        instagram: formData.get("instagram"),
      },
    };
    createArtistMutation.mutate(data);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and artist profile</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Package className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="artist">
            <Palette className="h-4 w-4 mr-2" />
            Artist
          </TabsTrigger>
          <TabsTrigger value="designs" disabled={!artistProfile}>
            <Eye className="h-4 w-4 mr-2" />
            My Designs
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
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

        {/* Orders Tab */}
        <TabsContent value="orders">
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

        {/* Artist Tab */}
        <TabsContent value="artist">
          <Card>
            <CardHeader>
              <CardTitle>Artist Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {!artistProfile ? (
                <div>
                  {!isCreatingArtist ? (
                    <div className="text-center py-8">
                      <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Become an Artist</h3>
                      <p className="text-gray-600 mb-6">
                        Join our community and start selling your designs
                      </p>
                      <Button onClick={() => setIsCreatingArtist(true)}>
                        Create Artist Profile
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateArtist} className="space-y-4">
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell us about yourself and your art..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                          id="specialty"
                          name="specialty"
                          placeholder="e.g., Digital Illustration, Typography"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="website">Website (Optional)</Label>
                          <Input
                            id="website"
                            name="website"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="instagram">Instagram (Optional)</Label>
                          <Input
                            id="instagram"
                            name="instagram"
                            placeholder="@yourusername"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Button 
                          type="submit" 
                          disabled={createArtistMutation.isPending}
                        >
                          {createArtistMutation.isPending ? "Creating..." : "Create Profile"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsCreatingArtist(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Bio</h3>
                    <p className="text-gray-600">{artistProfile.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Specialty</h3>
                    <p className="text-gray-600">{artistProfile.specialty}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Commission Rate</h3>
                    <p className="text-gray-600">{artistProfile.commissionRate}%</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Status</h3>
                    <p className="text-gray-600">
                      {artistProfile.isVerified ? "Verified" : "Pending Verification"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Designs Tab */}
        <TabsContent value="designs">
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
                  <Button 
                    type="submit" 
                    disabled={uploadDesignMutation.isPending || !selectedFile}
                  >
                    {uploadDesignMutation.isPending ? "Uploading..." : "Upload Design"}
                  </Button>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {designs.map((design: any) => (
                      <div key={design.id} className="border rounded-lg overflow-hidden">
                        <img
                          src={design.imageUrl}
                          alt={design.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="font-medium">{design.title}</h4>
                          <p className="text-sm text-gray-600">${design.price}</p>
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
      </Tabs>
    </div>
  );
}
