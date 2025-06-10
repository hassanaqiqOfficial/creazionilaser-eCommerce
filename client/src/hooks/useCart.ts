import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  userId: string;
  productId: number;
  designId?: number;
  quantity: number;
  price: string;
  customization?: any;
  createdAt: string;
  product?: any;
  design?: any;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

type CartAction =
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "UPDATE_ITEM"; id: number; quantity: number }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, "id" | "userId" | "createdAt">) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.item] };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
  });

  // Fetch cart items from server
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  // Fetch product and design details for cart items
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    enabled: cartItems.length > 0,
  });

  const { data: designs = [] } = useQuery({
    queryKey: ["/api/designs"],
    enabled: cartItems.length > 0,
  });

  // Enrich cart items with product and design details
  useEffect(() => {
    if (cartItems.length > 0 && products.length > 0) {
      const enrichedItems = cartItems.map((item: CartItem) => ({
        ...item,
        product: products.find((p: any) => p.id === item.productId),
        design: item.designId ? designs.find((d: any) => d.id === item.designId) : null,
      }));
      dispatch({ type: "SET_ITEMS", items: enrichedItems });
    } else {
      dispatch({ type: "SET_ITEMS", items: cartItems });
    }
  }, [cartItems, products, designs]);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", isLoading });
  }, [isLoading]);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<CartItem, "id" | "userId" | "createdAt">) => {
      const response = await apiRequest("POST", "/api/cart", item);
      return response.json();
    },
    onSuccess: (newItem) => {
      dispatch({ type: "ADD_ITEM", item: newItem });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      await apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: (_, { id, quantity }) => {
      dispatch({ type: "UPDATE_ITEM", id, quantity });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: (_, id) => {
      dispatch({ type: "REMOVE_ITEM", id });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      // Clear cart by removing all items individually
      await Promise.all(
        state.items.map((item) => apiRequest("DELETE", `/api/cart/${item.id}`))
      );
    },
    onSuccess: () => {
      dispatch({ type: "CLEAR_CART" });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addToCart = (item: Omit<CartItem, "id" | "userId" | "createdAt">) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate(item);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ id, quantity });
  };

  const removeFromCart = (id: number) => {
    removeFromCartMutation.mutate(id);
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        isLoading: state.isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemCount,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
