// src/components/UI-UX/offers/OfferCard.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, TrendingDown } from 'lucide-react';
import { Offer } from '@/lib/offersData';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const savings = offer.originalPrice - offer.discountedPrice;
  const savingsPercent = Math.round((savings / offer.originalPrice) * 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col h-full">
      {/* Badge & Category */}
      <div className="p-6 pb-0 flex justify-between items-start">
        <span className="bg-[#629D23]/10 text-[#629D23] text-[10px] font-bold px-3 py-1 uppercase rounded-full tracking-wider border border-[#629D23]/20">
          {offer.category}
        </span>
        <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 uppercase rounded-full shadow-lg shadow-red-500/20">
          {offer.badge}
        </span>
      </div>

      {/* Main Image & Bundle Preview */}
      <div className="p-8 pt-4 flex flex-col items-center">
        <div className="relative w-full aspect-square mb-8 group-hover:scale-105 transition-transform duration-500">
          <img 
            src={offer.image} 
            alt={offer.title} 
            className="w-full h-full object-contain"
          />
      {/* Bundle Products Grid */}
      <div className="px-6 py-4 bg-gray-50 border-y border-gray-100">
        <div className="grid grid-cols-3 gap-3">
          {offer.products.map((p, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-full aspect-square bg-white rounded-lg border border-gray-200 p-2 flex items-center justify-center hover:border-[#629D23] transition-colors group/img">
                <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-[9px] font-bold text-gray-500 mt-2 uppercase text-center truncate w-full">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
        </div>

        <div className="text-center mt-6">
          <h2 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-[#629D23] transition-colors">{offer.title}</h2>
          <p className="text-[#629D23] text-xs font-bold uppercase tracking-widest mb-4">{offer.subtitle}</p>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed px-4">{offer.description}</p>
        </div>

        {/* Pricing */}
        <div className="w-full bg-gray-50 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-gray-400 text-xs line-through block font-bold mb-1 uppercase tracking-tighter">WAS Rs {offer.originalPrice.toLocaleString()}</span>
              <span className="text-3xl font-black text-gray-900 leading-none">Rs {offer.discountedPrice.toLocaleString()}</span>
            </div>
            <div className="bg-[#629D23] text-white px-3 py-2 rounded-lg text-center shadow-lg shadow-[#629D23]/20">
              <TrendingDown className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs font-black">SAVE {savingsPercent}%</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <ul className="w-full space-y-3 mb-8">
          {offer.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#629D23] mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <button className="w-full py-4 bg-gray-900 hover:bg-[#629D23] text-white font-black uppercase tracking-widest rounded-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center group/btn shadow-xl shadow-gray-900/10 hover:shadow-[#629D23]/30">
          Claim Bundle Deal
          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}
