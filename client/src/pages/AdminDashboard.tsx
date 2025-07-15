import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Package, 
  ShoppingCart,
  GalleryThumbnails,   
  Settings, 
  BarChart3, 
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Ban,
  Eye,
  EyeOff,
  CheckCheck
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch admin data
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: artists } = useQuery({
    queryKey: ["/api/admin/artists"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/admin/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/admin/categories"],
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/admin/orders"],
  });

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users",icon: Users,listItems:[
        {id: "users", label: "Users",icon: Users},
        {id: "artists", label: "Artists",icon: Users} 
      ]
    },
    { id: "categories", label: "Categories", icon: Package ,listItems:[
        {id : "categories", label : "Categories",icon: Package },
        {id : "subcategories", label : "Sub Categories",icon: Package }
      ] 
    },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-blue-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                   (item.id !== 'users' && item.id !== 'categories') ? setActiveTab(item.id) : '';
                  (item.id !== 'users' && item.id !== 'categories') ? setSidebarOpen(false) : '';
                }}
                className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >

                 
                { (item.id === 'users') ? (

                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full justify-start flex px-1 py-4 text-left transition-all duration-200" variant="ghost" size="md">
                          <Icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                          {item.label}
                        </Button>
                      </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    
                    {item.listItems?.map((litems) => (
                      
                      

                      <DropdownMenuItem asChild>

                            <button
                                key={litems.id}
                                onClick={() => {
                                  setActiveTab(litems.id);
                                  setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 ${
                                  activeTab === litems.id 
                                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-medium' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <Icon className={`h-5 w-5 mr-3 ${activeTab === litems.id ? 'text-blue-600' : 'text-gray-500'}`} />
                                {litems.label}
                            </button>

                      </DropdownMenuItem>
                        
                    ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                )
                : item.id === 'categories' ?(

                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full justify-start flex px-1 py-4 text-left transition-all duration-200" variant="ghost" size="md">
                          <Icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                          {item.label}
                        </Button>
                      </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    
                    {item.listItems?.map((litems) => (
                      
                      <DropdownMenuItem asChild>

                            <button
                                key={litems.id}
                                onClick={() => {
                                  setActiveTab(litems.id);
                                  setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 ${
                                  activeTab === litems.id 
                                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-medium' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <Icon className={`h-5 w-5 mr-3 ${activeTab === litems.id ? 'text-blue-600' : 'text-gray-500'}`} />
                                {litems.label}
                            </button>

                      </DropdownMenuItem>
                        
                    ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                )
                :
                (

                  <>
                   <Icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                    {item.label}
                  </>

                )}
              </button>
            );

            

          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {(user as any)?.firstName} {(user as any)?.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate">{(user as any)?.email}</p>
              </div>
            </div>
            <Badge variant="default" className="mt-3 w-full justify-center bg-blue-600 hover:bg-blue-700">
              Administrator
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-4 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              {/* <p className="text-sm text-gray-600">Manage your platform from here</p> */}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Welcome back!</p>
              <p className="text-xs text-gray-600">{(user as any)?.firstName} {(user as any)?.lastName}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/api/auth/logout'}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {activeTab === "overview" && <OverviewTab stats={stats} />}
          {activeTab === "users" && <UsersTab users={users} />}
          {activeTab === "artists" && <ArtistsTab artists={artists} />}
          {activeTab === "categories" && <CategoriesTab categories={categories} />}
          {activeTab === "subcategories" && <SubCategoriesTab subcategories={categories} />}
          {activeTab === "products" && <ProductsTab products={products} categories={categories} />}
          {activeTab === "orders" && <OrdersTab orders={orders} />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ stats }: { stats?: any }) {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-blue-700">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-gray-600 mt-1">
              +{stats?.newUsersThisWeek || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-green-800">Products</CardTitle>
            <Package className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-700">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats?.totalCategories || 0} categories
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-purple-800">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-purple-700">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-gray-600 mt-1">
              ${stats?.totalRevenue || 0} revenue
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-orange-800">Artist Designs</CardTitle>
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-orange-700">{stats?.totalDesigns || 0}</div>
            <p className="text-xs text-gray-600 mt-1">
              From {stats?.totalArtists || 0} artists
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Product added to catalog</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">New artist design uploaded</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab({ users }: { users?: any[] }) {

  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const userRoles = [
    {id : 'customer',name : 'Customer'},
    {id : 'artist',name : 'Artist'}
  ]

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      console.log(userData);
      console.log('functioning...');
      return await apiRequest("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/users"] });
      setIsCreateOpen(false);
      toast({ title: "User created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create user",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...userData }: any) => {
      console.log(userData);
      console.log('funcitoning...');
      return await apiRequest(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/users"] });
      setEditingUser(null);
      toast({ title: "User updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update user",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest(`/api/admin/users/${userId}/1`, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "user block successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to block user",
        description: error.message,
        variant: "destructive"
      });
    },
  });


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage platform users and their permissions</CardDescription>
        </div>

         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogDescription>Adding a new user to your platform!</DialogDescription>
            </DialogHeader>
            <UserForm 
              userRoles={userRoles}
              onSubmit={(data) => createUserMutation.mutate(data)}
              isLoading={createUserMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update User information</DialogDescription>
            </DialogHeader>
            {editingUser && (
              <UserForm 
                user={editingUser}
                onSubmit={(data) => updateUserMutation.mutate({ id: editingUser.id, ...data })}
                isLoading={updateUserMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.userType === 'admin' ? 'default' : 'secondary'}>
                      {user.userType}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {/* <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button> */}
                      <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingUser(user)}
                      >
                      <Edit className="h-4 w-4"/>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to block "${user.firstName}"? This action cannot be undone.`)) {
                            blockUserMutation.mutate(user.id);
                          }
                        }}
                        disabled={blockUserMutation.isPending}
                      >
                      <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function UserForm({ userRoles, user, onSubmit, isLoading }: { 
  userRoles?: any[]; 
  user?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;

})  {

  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fname: user?.firstName || "",
    lname: user?.lastName || "",
    email: user?.email || "",
    password : user?.password || "",
    confirmPassword : user?.confirmPassword || "",
  });

 const handleSubmit = (e: React.FormEvent) => {
    
    e.preventDefault();
    
    if(!user){
      if (!formData.fname || !formData.lname || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Missing fields",
          description: "Please fill in all fields.",
          variant: "destructive",
        });
        return;
      }
    }    
    else{
      if (!formData.fname || !formData.lname || !formData.email) {
          toast({
            title: "Missing fields",
            description: "Please fill in all fields.",
            variant: "destructive",
          });
          return;
        }
    }

    if (!user && formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!user && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({  ...formData,
    });

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fname">First Name</Label>
        <Input
          id="fname"
          value={formData.fname}
          onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
          placeholder="e.g.,Firstname"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="lname">Last Name</Label>
        <Input
          id="lname"
          value={formData.lname}
          onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
          placeholder="e.g.,Lastname"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="e.g.,Google@gmail.com"
          required
        />
      </div>
      { (!user) && (

          <>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="cPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="cPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
      
      )}

      {/* <div>
        <Label htmlFor="usertype">User Type</Label>
        <Select value={formData.userType} onValueChange={(value) => setFormData({ ...formData, userType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select User Type" />
          </SelectTrigger>
          <SelectContent>
            {userRoles?.map((role: any) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}


      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (user ? "Updating..." : "Creating...") : (user ? "Update User" : "Create User")}
      </Button>
    </form>
  );
}

function ArtistsTab({ artists }: { artists?: any[] }) {

  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<any>(null);

  // const createArtistMutation = useMutation({
  //   mutationFn: async (artistData: any) => {
  //     return await apiRequest("/api/admin/artists", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(artistData),
  //     });
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["/api/admin/artists"] });
  //     queryClient.refetchQueries({ queryKey: ["/api/admin/artists"] });
  //     setIsCreateOpen(false);
  //     toast({ title: "Artist created successfully" });
  //   },
  //   onError: (error: any) => {
  //     toast({ 
  //       title: "Failed to create Artist",
  //       description: error.message,
  //       variant: "destructive"
  //     });
  //   },
  // });

  const updateArtistMutation = useMutation({
    mutationFn: async ({ id, ...artistData }: any) => {
      
     return await apiRequest(`/api/admin/artists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artistData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/artists"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/artists"] });
      setEditingArtist(null);
      toast(
        { title: "Artist updated successfully" }
      );
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update Artist",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const blockArtistMutation = useMutation({
    mutationFn: async (artistId: number) => {
      return await apiRequest(`/api/admin/artists/${artistId}/${1}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({isBlocked : 1}),    
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/artists"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/artists"] });
      toast({ title: "artist blocked successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to block artist",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const verificaionArtistMutation = useMutation({
    mutationFn: async (artistId: number) => {
      const isVerified = true;
      return await apiRequest(`/api/admin/artists/${artistId}/${1}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({isVerified : true}),      
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/artists"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/artists"] });
      toast({ title: "artist verified successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to verify artist",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Artist Management</CardTitle>
          <CardDescription>Manage platform Artist and their permissions</CardDescription>
        </div>

         {/* <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Artist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Artist</DialogTitle>
              <DialogDescription>Add a new user to your platform</DialogDescription>
            </DialogHeader>
            <ArtistForm 
              onSubmit={(data) => createArtistMutation.mutate(data)}
              isLoading={createArtistMutation.isPending}
            />
          </DialogContent>
        </Dialog> */}

        <Dialog open={!!editingArtist} onOpenChange={() => setEditingArtist(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Artist</DialogTitle>
              <DialogDescription>Update Artist information</DialogDescription>
            </DialogHeader>
            {editingArtist && (
              <ArtistForm 
                artist={editingArtist}
                onSubmit={(data) => updateArtistMutation.mutate({ id: editingArtist.id, ...data })}
                isLoading={updateArtistMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Speciality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists?.map((artist: any) => (
                
                <TableRow key={artist.id}>
                  <TableCell className="font-medium">{artist.firstName} {artist.lastName}</TableCell>
                  <TableCell>{artist.email}</TableCell>
                  <TableCell>
                    {artist.specialty}
                  </TableCell>
                  <TableCell>
                    {artist.isVerified}
                    { 
                      artist.isVerified === true ? (
                        <Badge className="lg-rounded" variant="default" size="sm"> Verified </Badge>
                      )
                      : artist.isVerified === false && (
                        <Badge className="lg-rounded" variant="destructive" size="sm"> Pending </Badge>
                      )
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingArtist(artist)}
                      >
                      <Edit className="h-4 w-4"/>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to block "${artist.firstName}"? This action cannot be undone.`)) {
                            blockArtistMutation.mutate(artist.id);
                          }
                        }}
                        disabled={blockArtistMutation.isPending}
                      >
                      <Ban className="h-4 w-4"/>
                      </Button>
                      {artist.isVerified !== true && artist.isBlocked === 0 && (
                      <Button variant="default" 
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to verify "${artist.firstName}"? This action cannot be undone.`)) {
                            verificaionArtistMutation.mutate(artist.id);
                          }
                        }}
                        disabled={verificaionArtistMutation.isPending}
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ArtistForm({ userRoles, artist, onSubmit, isLoading }: { 
  userRoles?: any[]; 
  artist?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
})  {
  const [formData, setFormData] = useState({
    fname: artist?.firstName || "",
    lname: artist?.lastName || "",
    email: artist?.email || "",
    specialty: artist?.specialty || "",
    biography: artist?.biography || "",
    userType: artist?.userType || "",
    bio: artist?.bio || ""

  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fname">Full name</Label>
        <Input
          id="fname"
          type="text"
          value={formData.fname+' '+formData.lname}
          disabled
          onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
          required
        />
      </div>
      
      {/* <div>
        <Label htmlFor="lname">Last Name</Label>
        <Input
          id="lname"
          type="text"
          value={formData.lname}
          disabled
          onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
        />
      </div> */}

      {/* <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          disabled
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        
      </div> */}

      <div>
        <Label htmlFor="usertype">User Type</Label>
        <Input
          id="userType"
          type="text"
          disabled
          value={formData.userType}
          onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
          required
        />
      </div>

       <div>
        <Label htmlFor="speciality">Speciality</Label>
        <Textarea
          id="speciality"
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          required
        />
      </div>

       <div>
        <Label htmlFor="biography">Biography</Label>
        <Textarea
          id="biography"
          value={formData.biography}
          onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (artist ? "Updating..." : "Creating...") : (artist ? "Update Artist" : "Create Artist")}
      </Button>
    </form>
  );
}

function ProductsTab({ products, categories }: { products?: any[]; categories?: any[] }) {
  
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return await apiRequest("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/products"] });
      setIsCreateOpen(false);
      toast({ title: "Product created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create product",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...productData }: any) => {
      return await apiRequest(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/products"] });
      setEditingProduct(null);
      toast({ title: "Product updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update product",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      return await apiRequest(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product catalog and inventory</CardDescription>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>Add a new product to your catalog</DialogDescription>
            </DialogHeader>
            <ProductForm 
              categories={categories} 
              onSubmit={(data) => createProductMutation.mutate(data)}
              isLoading={createProductMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product information</DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <ProductForm 
                categories={categories} 
                product={editingProduct}
                onSubmit={(data) => updateProductMutation.mutate({ id: editingProduct.id, ...data })}
                isLoading={updateProductMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>${product.basePrice}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
                            deleteProductMutation.mutate(product.id);
                          }
                        }}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!products || products.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No products yet. Add your first product to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductForm({ categories, product, onSubmit, isLoading }: { 
  categories?: any[]; 
  product?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
})  {
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    categoryId: product?.categoryId?.toString() || "",
    basePrice: product?.basePrice || "",
    imageUrl: product?.imageUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      categoryId: parseInt(formData.categoryId),
      basePrice: formData.basePrice,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category: any) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="basePrice">Price ($)</Label>
        <Input
          id="basePrice"
          type="number"
          step="0.01"
          value={formData.basePrice}
          onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (product ? "Updating..." : "Creating...") : (product ? "Update Product" : "Create Product")}
      </Button>
    </form>
  );
}

function OrdersTab({ orders }: { orders?: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.length ? orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No orders yet. Orders will appear here when customers start purchasing.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoriesTab({ categories }: { categories?: any[] }) {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      return await apiRequest("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/categories"] });
      setIsCreateOpen(false);
      toast({ title: "Category created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create category",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...categoryData }: any) => {
      return await apiRequest(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/categories"] });
      setEditingCategory(null);
      toast({ title: "Category updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update category",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      return await apiRequest(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: (error: any) => {
      let errorMessage = error.message;
      
      // Check if it's a constraint violation
      if (error.message.includes("product(s) are using this category")) {
        errorMessage = error.message;
      } else if (error.message.includes("violates foreign key constraint")) {
        errorMessage = "Cannot delete category. Products are still using this category.";
      }
      
      toast({ 
        title: "Cannot Delete Category",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Organize your products with categories</CardDescription>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>Add a new product category</DialogDescription>
            </DialogHeader>
            <CategoryForm 
              onSubmit={(data) => createCategoryMutation.mutate(data)}
              isLoading={createCategoryMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Edit existing product category</DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <CategoryForm 
                category={editingCategory}
                onSubmit={(data) => updateCategoryMutation.mutate({id : editingCategory.id , ...data})}
                isLoading={updateCategoryMutation.isPending}
              />
            )}
            
          </DialogContent>
        </Dialog>

      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow> 
            </TableHeader>
            <TableBody>
              {categories?.map((category: any) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || 'No description'}</TableCell>
                  <TableCell className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{category.slug}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
                            deleteCategoryMutation.mutate(category.id);
                          }
                        }}
                        disabled={deleteCategoryMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!categories || categories.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No categories yet. Create your first category to organize products.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryForm({ category, onSubmit, isLoading }: { 
  category?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {

  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    slug: category?.slug || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ 
      ...formData, 
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="e.g., Custom T-Shirts"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this category"
        />
      </div>

      <div>
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="auto-generated from name"
        />
        <p className="text-xs text-gray-500 mt-1">Used in URLs, auto-generated if left empty</p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (category ? "Updating..." : "Creating...") : (category ? "Update Category" : "Create Category")}
      </Button>
    </form>
  );
}

function SubCategoriesTab({ subcategories }: { subcategories?: any[] }) {

  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

  const createSubCategoryMutation = useMutation({
    mutationFn: async (subcategoryData: any) => {
      return await apiRequest("/api/admin/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subcategoryData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subcategories"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/subcategories"] });
      setIsCreateOpen(false);
      toast({ title: "subCategory created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create subcategory",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateSubCategoryMutation = useMutation({
    mutationFn: async ({ id, ...subcategoryData }: any) => {
      return await apiRequest(`/api/admin/subcategories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subcategoryData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subcategories"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/subcategories"] });
      setEditingSubCategory(null);
      toast({ title: "subCategory updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update subcategory",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const deleteSubCategoryMutation = useMutation({
    mutationFn: async (subcategoryId: number) => {
      return await apiRequest(`/api/admin/subsubcategories/${subcategoryId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subcategories"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/subcategories"] });
      toast({ title: "subCategory deleted successfully" });
    },
    onError: (error: any) => {
      let errorMessage = error.message;
      
      // Check if it's a constraint violation
      if (error.message.includes("product(s) are using this subcategory")) {
        errorMessage = error.message;
      } else if (error.message.includes("violates foreign key constraint")) {
        errorMessage = "Cannot delete category. Products are still using this subcategory.";
      }
      
      toast({ 
        title: "Cannot Delete subCategory",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sub Category Management</CardTitle>
          <CardDescription>Organize your products with subcategories</CardDescription>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Sub Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Sub Category</DialogTitle>
              <DialogDescription>Add a new product subcategory</DialogDescription>
            </DialogHeader>
            <SubCategoryForm 
              onSubmit={(data) => createSubCategoryMutation.mutate(data)}
              isLoading={createSubCategoryMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingSubCategory} onOpenChange={() => setEditingSubCategory(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit subCategory</DialogTitle>
              <DialogDescription>Edit existing product subcategory</DialogDescription>
            </DialogHeader>
            {editingSubCategory && (
              <SubCategoryForm 
                subcategory={editingSubCategory}
                onSubmit={(data) => updateSubCategoryMutation.mutate({id : editingSubCategory.id , ...data})}
                isLoading={updateSubCategoryMutation.isPending}
              />
            )}
            
          </DialogContent>
        </Dialog>

      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow> 
            </TableHeader>
            <TableBody>
              {subcategories?.map((subcategory: any) => (
                <TableRow key={subcategory.id}>
                  <TableCell className="font-medium">{subcategory.name}</TableCell>
                  <TableCell>{subcategory.description || 'No description'}</TableCell>
                  <TableCell className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{subcategory.slug}</TableCell>
                  <TableCell>{new Date(subcategory.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingSubCategory(subcategory)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${subcategory.name}"? This action cannot be undone.`)) {
                            deleteSubCategoryMutation.mutate(subcategory.id);
                          }
                        }}
                        disabled={deleteSubCategoryMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!subcategories || subcategories.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No subcategories yet. Create your first subcategory to organize products.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function SubCategoryForm({ subcategory, onSubmit, isLoading }: { 
  subcategory?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {

  const [formData, setFormData] = useState({
    name: subcategory?.name || "",
    description: subcategory?.description || "",
    slug: subcategory?.slug || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ 
      ...formData, 
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="e.g., Custom T-Shirts"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this category"
        />
      </div>

      <div>
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="auto-generated from name"
        />
        <p className="text-xs text-gray-500 mt-1">Used in URLs, auto-generated if left empty</p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (category ? "Updating..." : "Creating...") : (category ? "Update Category" : "Create Category")}
      </Button>
    </form>
  );
}

function SettingsTab() {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({ title: "Settings saved successfully" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Configure your e-commerce platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="commission">Artist Commission (%)</Label>
              <Input id="commission" type="number" defaultValue="30" />
            </div>
            
            <div>
              <Label htmlFor="tax">Tax Rate (%)</Label>
              <Input id="tax" type="number" step="0.01" defaultValue="0" />
            </div>

            <div>
              <Label htmlFor="shipping">Default Shipping ($)</Label>
              <Input id="shipping" type="number" step="0.01" defaultValue="5.99" />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Orders</p>
              <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Users</p>
              <p className="text-sm text-gray-500">Get notified when users register</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Artist Uploads</p>
              <p className="text-sm text-gray-500">Get notified when artists upload designs</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}