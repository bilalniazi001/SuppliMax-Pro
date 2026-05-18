'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const BACKGROUND_IMAGE_URL = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop';

export default function HeroSection() {
  return (
    <section 
      className="relative w-full h-[500px] md:h-[650px] flex items-center bg-gray-900 overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl text-white">
          <div className="inline-flex items-center space-x-2 mb-6">
            <span className="w-8 h-[2px] bg-[#629D23]"></span>
            <span className="text-[#629D23] font-bold tracking-[0.2em] uppercase text-sm md:text-base">
              Fuel Your Ambition
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 leading-[1.1] uppercase tracking-tighter">
            Unleash Your <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#629D23]">
              Inner Beast
            </span>
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-10 max-w-xl font-light leading-relaxed border-l-4 border-[#629D23] pl-4 sm:pl-6">
            Elevate your performance with our premium, science-backed supplements designed for serious athletes.
          </p>
          
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/product"
              className="group inline-flex items-center justify-center px-5 py-2.5 sm:px-8 sm:py-4 text-xs sm:text-base font-bold text-white uppercase tracking-wider bg-[#629D23] hover:bg-[#4a7a1a] rounded-full transition-all duration-300 shadow-lg hover:shadow-[#629D23]/50"
            >
              Shop Collection
              <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-8 sm:py-4 text-xs sm:text-base font-bold text-white uppercase tracking-wider bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 rounded-full transition-all duration-300"
            >
              View Offers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}