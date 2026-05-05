'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PromoBanners() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Banner 1 - Large Left */}
        <div 
          className="relative rounded-3xl overflow-hidden group h-[400px] md:h-[500px] flex items-center shadow-xl"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-500"></div>
          
          <div className="relative z-10 p-8 md:p-12 w-full">
            <span className="inline-block px-3 py-1 bg-[#629D23] text-white font-bold tracking-widest text-xs uppercase rounded-full mb-4">
              Best Quality
            </span>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase leading-tight tracking-tight">
              Up to 30% Off <br/><span className="text-[#629D23]">Protein</span>
            </h3>
            <p className="text-gray-200 mb-8 max-w-sm text-lg">Premium supplements to fuel your toughest workouts and speed up recovery.</p>
            <Link 
              href="/product" 
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold uppercase text-sm rounded-full hover:bg-[#629D23] hover:text-white transition-all duration-300 transform group-hover:translate-x-2"
            >
              Shop Collection <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Banners Right Column */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Banner 2 - Top Right */}
          <div 
            className="relative rounded-3xl overflow-hidden group h-[200px] md:h-[235px] flex items-center shadow-lg"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent group-hover:from-gray-900 transition-colors duration-500"></div>

            <div className="relative z-10 p-8 w-full max-w-sm">
              <span className="text-[#629D23] font-bold mb-2 text-xs uppercase tracking-widest block">New Arrivals</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 uppercase leading-tight">
                Check Out What's New
              </h3>
              <Link 
                href="/product" 
                className="inline-flex items-center text-white font-bold text-sm uppercase hover:text-[#629D23] transition-colors"
              >
                Discover More <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Banner 3 - Bottom Right */}
          <div 
            className="relative rounded-3xl overflow-hidden group h-[200px] md:h-[235px] flex items-center shadow-lg"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-[#629D23]/80 mix-blend-multiply group-hover:bg-[#629D23]/90 transition-colors duration-500"></div>

            <div className="relative z-10 p-8 w-full text-center flex flex-col items-center justify-center">
              <span className="text-white/80 font-bold mb-2 text-xs uppercase tracking-widest block">Exclusive Offer</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6 uppercase leading-tight">
                BodyFit Members Save 10%
              </h3>
              <Link 
                href="/product" 
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-bold uppercase text-sm rounded-full hover:bg-white hover:text-[#629D23] transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
