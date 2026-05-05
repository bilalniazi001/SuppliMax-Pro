// src/components/UI-UX/offers/OffersHeader.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Percent } from 'lucide-react';

export default function OffersHeader() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>
        <div className="absolute inset-0 bg-[#4a7a1b]/20 mix-blend-multiply"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 bg-[#2D3B29] text-white px-4 py-2 rounded-full mb-6 animate-bounce">
          <Percent className="w-4 h-4 text-[#629D23]" />
          <span className="text-xs font-bold uppercase tracking-wider">Flash Sale: Up to 40% Off!</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-tight">
          Special <span className="text-[#629D23]">Offers</span> & Bundles
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg font-medium">
          Maximize your results and minimize your costs. Shop our curated product stacks and premium transformation packages.
        </p>
        <nav className="flex justify-center items-center space-x-2 text-white/60 text-sm font-bold uppercase tracking-widest">
          <Link href="/" className="hover:text-[#629D23] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Offers</span>
        </nav>
      </div>
    </section>
  );
}
