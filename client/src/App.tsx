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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/hooks/useCart";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/">
        {isAuthenticated ? (
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/shop" component={Shop} />
                <Route path="/create" component={Create} />
                <Route path="/artists" component={Artists} />
                <Route path="/profile" component={Profile} />
                <Route path="/cart" component={Cart} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        ) : (
          <Landing />
        )}
      </Route>
    </Switch>
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
