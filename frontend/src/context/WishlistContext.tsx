'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '@/config';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist (from DB if logged in, else localStorage)
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await fetch(`${API_BASE_URL}/wishlist/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            const wishlistData = Array.isArray(data) ? data : (data.value || []);
            
            const productsRes = await fetch(`${API_BASE_URL}/products`);
            const productsData = await productsRes.json();
            const allProducts = Array.isArray(productsData) ? productsData : (productsData.value || []);
            
            const fullWishlist = wishlistData.map((item: any) => {
              return allProducts.find((p: any) => p.id === item.productId);
            }).filter(Boolean);
            
            setWishlist(fullWishlist);
            return;
          }
        } catch (e) {
          console.error('Failed to load wishlist from DB', e);
        }
      }

      const key = user ? `supplimax_wishlist_${user.id}` : 'supplimax_wishlist_guest';
      const savedWishlist = localStorage.getItem(key);
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (e) {
          console.error('Failed to parse wishlist from localStorage', e);
        }
      } else {
        setWishlist([]);
      }
    };

    loadWishlist();
  }, [isAuthenticated, user]);

  // Save to localStorage
  useEffect(() => {
    const key = user ? `supplimax_wishlist_${user.id}` : 'supplimax_wishlist_guest';
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, user]);

  const addToWishlist = async (product: Product) => {
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/wishlist/${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });
      } catch (e) {
        console.error('Failed to sync add to wishlist', e);
      }
    }

    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = async (productId: string) => {
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/wishlist/${user.id}/${productId}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('Failed to sync remove from wishlist', e);
      }
    }

    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => wishlist.some((item) => item.id === productId);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
