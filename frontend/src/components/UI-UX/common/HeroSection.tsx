'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link'; // ✅ Next.js Link import karein

// Replace this with the actual URL of your background image
const BACKGROUND_IMAGE_URL = 'https://miro.medium.com/v2/resize:fit:612/1*oJbsYzjkVn5ypv3XIAnhCg.jpeg';

/**
 * Hero Section Component for SuppliMax
 * Designed to match the provided fitness/supplement image layout.
 */
export default function HeroSection() {
  return (
    <section 
      className="relative w-full h-[600px] overflow-hidden bg-black"
      style={{
        // Set the background image and its properties
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 1. Dark Overlay (Reddish/Black tint) */}
      <div className="absolute inset-0 bg-black opacity-70 backdrop-blur-sm"></div>
      
      {/* 2. Content Container */}
      <div className="container mx-auto h-full relative z-10 flex items-center justify-between px-4">
        
        {/* Left Side: Text and CTA */}
        <div className="max-w-xl text-white pt-20">
          
          {/* Discount Badge (Cyber Monday Sale) */}
          <span className="text-sm font-semibold uppercase tracking-widest text-[#FF9800] mb-2 inline-block">
            CYBER MONDAY SALE
          </span>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-4">
            Boost your <span className="text-[#FF9800]">immune system</span> today
          </h1>

          {/* Subtext */}
          <p className="text-lg mb-8 text-gray-300">
            24g of pure protein for enhanced lean muscle. Unlock your full potential.
          </p>

          {/* ✅ Shop Now Button - Converted to Next.js Link */}
          <Link
            href="/product" // ✅ Next.js compatible path
            className="inline-flex items-center space-x-2 px-8 py-4 bg-[#FF9800] text-black font-bold uppercase text-base rounded-lg shadow-xl hover:bg-[#E68A00] transition-colors duration-200 transform hover:scale-105"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
        
        {/* Right Side: Product Images and Discount Circle */}
        <div className="relative w-1/2 h-full flex items-center justify-end">
            
            {/* Product Image */}
            {/* The image is slightly tilted and positioned for a powerful visual effect */}
            {/* Z-index adjust kiya gaya taaki discount circle uske upar aa sake */}
            {/*<img 
              src={SUPPLEMENT_IMAGE_URL} 
              alt="Protein Supplement Products"
              className="w-full max-w-md object-contain transform rotate-[-5deg] translate-x-4 translate-y-8 drop-shadow-2xl z-10" // Reduced max-w-lg to max-w-md and scale removed to better fit the transparent image
            />
*/}
            {/* Discount Circle (30% OFF) - Position adjusted to be to the right top of the product */}
            
            {/*<div className="absolute top-10 right-10 w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl z-20">
                <div className='flex flex-col items-center leading-none'>
                    <span className='text-3xl'>30%</span>
                    <span className='text-sm font-bold'>OFF</span>
                </div>
            </div>*/}
        </div>
        
        {/* Decorative Circle Dot (from the image) */}
        <div className="absolute bottom-5 left-1/2 w-3 h-3 bg-[#FF9800] rounded-full transform -translate-x-1/2"></div>
      </div>
    </section>
  );
}