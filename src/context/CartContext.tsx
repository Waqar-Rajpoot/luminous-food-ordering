"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { useSession } from "next-auth/react"; // Import session

interface Product {
  id: string; 
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addItemToCart: (product: Product) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItemFromCart: (id: string) => void;
  clearCart: () => void;
  getOriginalCartTotal: () => number;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id);
      const quantityToAdd = action.payload.quantity || 1;
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...state, { ...action.payload as CartItem, quantity: quantityToAdd }];
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload.id);
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession(); // Get user session
  const [initialised, setInitialised] = useState(false);
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Generate a Unique Key based on User ID
  const userId = session?.user?._id;
  const CART_STORAGE_KEY = userId ? `luminous_cart_${userId}` : 'luminous_cart_guest';

  // 1. Load/Switch Cart when User ID changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If logging out (unauthenticated), clear the current state cart
      if (status === "unauthenticated") {
        dispatch({ type: 'SET_CART', payload: [] });
        setInitialised(false);
        return;
      }

      // If we have a key (either guest or logged in user)
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      const initialCart = storedCart ? JSON.parse(storedCart) : [];
      dispatch({ type: 'SET_CART', payload: initialCart });
      setInitialised(true);
    }
  }, [userId, status, CART_STORAGE_KEY]); 

  // 2. Save to localStorage whenever cart changes
  useEffect(() => {
    if (initialised && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, initialised, CART_STORAGE_KEY]);

  const addItemToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItemFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getOriginalCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
        cart, cartCount, addItemToCart, updateQuantity, 
        removeItemFromCart, clearCart, getOriginalCartTotal, dispatch 
    }}>
      {children} 
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};