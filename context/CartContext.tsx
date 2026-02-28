"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types/product";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  /* persist cart */
  useEffect(() => {
    const stored = localStorage.getItem("amar-gaia-cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("amar-gaia-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    setCart(prev =>
      qty <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const getTotal = () =>
    cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const getCount = () =>
    cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, clearCart, getTotal, getCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};