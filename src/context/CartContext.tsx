'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  vendorId: string;
  vendorName: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getVendorItems: (vendorId: string) => CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'stn_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage बाट लोड गर्ने
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Cart load error:', error);
    }
    setIsLoaded(true);
  }, []);

  // localStorage मा सेभ गर्ने
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        toast.success(`${item.name} को परिमाण बढ्यो`);
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${item.name} कार्टमा थपियो`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        toast.success(`${item.name} हटाइयो`);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => {
    setItems([]);
    toast.success('कार्ट खाली गरियो');
  };

  // एउटै vendor का सामानहरू
  const getVendorItems = (vendorId: string) => {
    return items.filter(item => item.vendorId === vendorId);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Loading हुँदा null देखाउने (hydration issue बच्न)
  if (!isLoaded) {
    return null;
  }

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, 
      total, itemCount, getVendorItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};