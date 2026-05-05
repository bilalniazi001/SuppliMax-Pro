// src/app/layout.tsx
import React from 'react'; 
import './globals.css';
import Providers from './Providers';

export const metadata = {
  title: 'SuppliMax | Premium Supplements Store',
  description: 'Your one-stop shop for premium fitness supplements, bundles, and health advice.',
};

interface RootLayoutProps {
  children: React.ReactNode; 
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}