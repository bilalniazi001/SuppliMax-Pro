'use client';

import React from 'react';
import { brands } from '@/lib/brandVendorData';

export default function BrandSlider() {
  // Split brands into two rows for a more dynamic "Deel" feel
  const row1 = brands.slice(0, Math.ceil(brands.length / 2));
  const row2 = brands.slice(Math.ceil(brands.length / 2));

  // Double each row for seamless infinite scroll
  const duplicatedRow1 = [...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2];

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 mb-16 text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-gray-400">
          Brands
        </h2>
        <div className="w-12 h-1 bg-[#629D23] mx-auto mt-4 opacity-50"></div>
      </div>

      <div className="space-y-12">
        {/* Row 1 */}
        <div className="flex relative">
          <div className="flex animate-scroll-right-to-left whitespace-nowrap items-center">
            {duplicatedRow1.map((brand, index) => (
              <div 
                key={`r1-${brand.id}-${index}`}
                className="mx-12 lg:mx-20 flex flex-col items-center justify-center group cursor-default min-w-[150px]"
              >
                <div className="h-20 w-40 flex items-center justify-center">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="max-w-full max-h-full object-contain filter grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-[#629D23] transition-colors">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex relative">
          <div className="flex animate-scroll-right-to-left-slow whitespace-nowrap items-center">
            {duplicatedRow2.map((brand, index) => (
              <div 
                key={`r2-${brand.id}-${index}`}
                className="mx-12 lg:mx-20 flex flex-col items-center justify-center group cursor-default min-w-[150px]"
              >
                <div className="h-20 w-40 flex items-center justify-center">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="max-w-full max-h-full object-contain filter grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-[#629D23] transition-colors">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Gradients for fading effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <style jsx>{`
        @keyframes scroll-rtl {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-right-to-left {
          animation: scroll-rtl 35s linear infinite;
        }
        .animate-scroll-right-to-left-slow {
          animation: scroll-rtl 45s linear infinite;
        }
        .container {
          max-width: 1200px;
        }
      `}</style>
    </section>
  );
}
