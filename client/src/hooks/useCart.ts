import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  productId: number;
  designId?: number;
  quantity: number;
  price: string;
  customization?: any;
  product?: any;
  design?: any;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (item: any) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
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
  const { toast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
  });

  const addToCart = (item: any) => {
    const newItem: CartItem = {
      id: Date.now(), // Simple ID generation for local cart
      productId: item.productId,
      designId: item.designId,
      quantity: item.quantity || 1,
      price: item.price,
      customization: item.customization,
      product: item.product,
      design: item.design,
    };
    
    dispatch({ type: "ADD_ITEM", item: newItem });
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart.",
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    dispatch({ type: "UPDATE_ITEM", id, quantity });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", id });
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

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
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}