'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '@/config';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Load cart (from DB if logged in, else localStorage)
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await fetch(`${API_BASE_URL}/cart/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            // Handle {value: []} or []
            const cartData = Array.isArray(data) ? data : (data.value || []);
            
            // We need product details for each cart item. 
            // For now, let's assume the backend or a local map provides them.
            // Simplified: Fetch all products once or use what we have.
            const productsRes = await fetch(`${API_BASE_URL}/products`);
            const productsData = await productsRes.json();
            const allProducts = Array.isArray(productsData) ? productsData : (productsData.value || []);
            
            const fullCart = cartData.map((item: any) => {
              const product = allProducts.find((p: any) => p.id === item.productId);
              return product ? { ...product, quantity: item.quantity } : null;
            }).filter(Boolean);
            
            setCart(fullCart);
            return;
          }
        } catch (e) {
          console.error('Failed to load cart from DB', e);
        }
      }

      // Fallback to localStorage (isolated by user if possible)
      const key = user ? `supplimax_cart_${user.id}` : 'supplimax_cart_guest';
      const savedCart = localStorage.getItem(key);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      } else {
        setCart([]);
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Save to localStorage (as backup/fallback)
  useEffect(() => {
    const key = user ? `supplimax_cart_${user.id}` : 'supplimax_cart_guest';
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user]);

  const addToCart = async (product: Product) => {
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/cart/${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
      } catch (e) {
        console.error('Failed to sync add to cart', e);
      }
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/cart/${user.id}/${productId}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('Failed to sync remove from cart', e);
      }
    }

    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/cart/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });
      } catch (e) {
        console.error('Failed to sync update quantity', e);
      }
    }

    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/cart/${user.id}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('Failed to sync clear cart', e);
      }
    }
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
