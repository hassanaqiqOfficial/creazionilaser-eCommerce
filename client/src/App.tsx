import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Create from "@/pages/Create";
import Artists from "@/pages/Artists";
import Profile from "@/pages/Profile";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Landing from "@/pages/Landing";
import AdminDashboard from "@/pages/AdminDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/hooks/useCart";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Debug logging removed for production

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/admin">
        {isAuthenticated && (user as any)?.userType === 'admin' ? (
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <AdminDashboard />
            </main>
            <Footer />
          </div>
        ) : isAuthenticated ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-lg text-gray-600">Admin privileges required.</p>
          </div>
        ) : (
          <Login />
        )}
      </Route>
      <Route path="/">
        {isAuthenticated ? (
          <AuthenticatedApp user={user} />
        ) : (
          <Landing />
        )}
      </Route>
    </Switch>
  );
}

function AuthenticatedApp({ user }: { user: any }) {
  const isAdmin = (user as any)?.userType === 'admin';

  // Auto-redirect admins to admin dashboard on root path
  React.useEffect(() => {
    if (isAdmin && window.location.pathname === '/') {
      window.location.href = '/admin';
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={isAdmin ? AdminDashboard : Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/create" component={Create} />
          <Route path="/artists" component={Artists} />
          <Route path="/profile" component={Profile} />
          <Route path="/cart" component={Cart} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function UnauthorizedAccess() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-8">
        You don't have permission to access the admin panel.
      </p>
      <p className="text-sm text-gray-500">
        Contact your administrator if you believe this is an error.
      </p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
