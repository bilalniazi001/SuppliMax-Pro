// src/app/Providers.tsx
'use client';
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

  const innerProviders = (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );

  if (isGoogleConfigured) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        {innerProviders}
      </GoogleOAuthProvider>
    );
  }

  return innerProviders;
}
