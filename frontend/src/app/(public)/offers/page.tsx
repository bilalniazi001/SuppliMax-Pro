// src/app/(public)/offers/page.tsx
'use client';
import React from 'react';
import OffersHeader from '@/components/UI-UX/offers/OffersHeader';
import OfferCard from '@/components/UI-UX/offers/OfferCard';
import { offers } from '@/lib/offersData';
import { Flame, Info, Percent } from 'lucide-react';

export default function OffersPage() {
  return (
    <main className="bg-white min-h-screen">
      <OffersHeader />

      <section className="py-20">
        <div className="container mx-auto px-4">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-gray-100 pb-10">
            <div className="max-w-xl">
              <div className="flex items-center space-x-2 text-[#629D23] font-bold text-sm uppercase tracking-widest mb-2">
                <Flame className="w-4 h-4 fill-current" />
                <span>Trending Deals</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                Our Best <span className="text-[#629D23]">Value</span> Stacks
              </h2>
            </div>
            <p className="text-gray-500 font-medium text-sm md:text-right max-w-xs">
              Hand-picked combinations by our nutrition experts to help you reach your goals faster.
            </p>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Premium Subscription Section */}
          <div className="mt-24 bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-8 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="90" cy="10" r="30" fill="#629D23" />
                <circle cx="10" cy="90" r="40" fill="#4a7a1b" />
              </svg>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="bg-[#629D23] text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] mb-6 inline-block shadow-lg shadow-[#629D23]/40">
                  Elite Loyalty Program
                </span>
                <h3 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                  Premium <span className="text-[#629D23]">Subscription</span>
                </h3>
                <p className="text-gray-400 text-lg md:text-xl font-medium mb-10 leading-relaxed">
                  Join the thousands of athletes who save time and money by automating their nutrition. Get your essentials delivered monthly without the hassle.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#629D23] border border-white/10">
                      <Percent className="w-6 h-6" />
                    </div>
                    <span className="text-white font-bold text-sm">Extra 15% Off Always</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#629D23] border border-white/10">
                      <Flame className="w-6 h-6" />
                    </div>
                    <span className="text-white font-bold text-sm">Free Delivery</span>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-12 py-5 bg-[#629D23] hover:bg-white hover:text-[#629D23] text-white font-black uppercase tracking-widest rounded-2xl transition-all duration-300 transform hover:-translate-y-2 shadow-2xl shadow-[#629D23]/40">
                  Join Elite Club Now
                </button>
              </div>
              <div className="hidden lg:block relative">
                 <div className="absolute inset-0 bg-[#629D23]/20 blur-[100px] rounded-full"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000" 
                   alt="Elite Training" 
                   className="relative rounded-3xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                 />
              </div>
            </div>
          </div>

          {/* Terms info */}
          <div className="mt-16 flex items-center justify-center space-x-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <Info className="w-4 h-4" />
            <span>* Prices are subject to availability. Bundle discounts cannot be combined with other coupons.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
