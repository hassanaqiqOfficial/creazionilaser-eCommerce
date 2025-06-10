import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
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

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: any;
  updateQuantity: any;
  removeFromCart: any;
  clearCart: any;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

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

export function CartProvider({ children }: { children: ReactNode }): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
  });

  // Fetch cart items when user is authenticated
  const { data: cartData } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (cartData && typeof cartData === 'object') {
      const data = cartData as any;
      const { cartItems, products, designs } = data;
      if (cartItems && Array.isArray(cartItems)) {
        const enrichedItems = cartItems.map((item: CartItem) => ({
          ...item,
          product: products && Array.isArray(products) ? products.find((p: any) => p.id === item.productId) : null,
          design: item.designId && designs && Array.isArray(designs) ? designs.find((d: any) => d.id === item.designId) : null,
        }));
        
        dispatch({ type: "SET_ITEMS", items: enrichedItems });
      }
    }
  }, [cartData]);

  const addToCart = useMutation({
    mutationFn: async (item: any) => {
      const response = await apiRequest("/api/cart", {
        method: "POST",
        body: JSON.stringify(item),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: "ADD_ITEM", item: data });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      return await apiRequest(`/api/cart/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
    },
    onSuccess: (_, variables) => {
      dispatch({ type: "UPDATE_ITEM", id: variables.id, quantity: variables.quantity });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart item.",
        variant: "destructive",
      });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/cart/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: (_, id) => {
      dispatch({ type: "REMOVE_ITEM", id });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    },
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/cart", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      dispatch({ type: "CLEAR_CART" });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    },
  });

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  };

  const contextValue = {
    cartItems: state.items,
    isLoading: state.isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    getTotalPrice,
  };

  return React.createElement(
    CartContext.Provider,
    { value: contextValue },
    children
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}