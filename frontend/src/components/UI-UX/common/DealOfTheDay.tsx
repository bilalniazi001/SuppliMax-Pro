'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DealOfTheDay() {
  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date 3 days from now for demo purposes
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="relative w-full pt-16 md:pt-24 pb-32 md:pb-40 mt-12 mb-12">
      
      {/* Main Background Banner (does not cover the full height, allowing card to stick out) */}
      <div 
        className="absolute inset-x-0 top-0 h-[85%] z-0 bg-[#111111]"
      >
        <div 
          className="absolute inset-0 z-0 grayscale opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        {/* Decorative Green Slashes (Left) */}
        <div className="absolute top-0 left-[5%] md:left-[10%] h-full flex gap-4 transform -skew-x-[20deg] opacity-60 z-0">
          <div className="w-4 h-full bg-gradient-to-b from-[#629D23]/0 via-[#629D23]/50 to-[#629D23]/0"></div>
          <div className="w-8 h-full bg-gradient-to-b from-[#629D23]/0 via-[#629D23]/30 to-[#629D23]/0"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Side: Product Image */}
          {/* Shifted left and down. Used multiply to remove white bg cleanly and scale to crop sides */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-center mb-10 md:mb-0 relative top-10 md:-left-8">
            <div className="relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] flex items-center justify-center overflow-hidden">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjb2flqdTpeFZMawQooUBZcadnRcaXcd4nFg&s" 
                alt="Optimum Nutrition Gold Standard Whey" 
                className="relative z-10 w-full h-full object-cover transform scale-125 hover:scale-[1.35] mix-blend-multiply brightness-110 contrast-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Side: Deal Box */}
          {/* Pushed further down via translate-y-[35%] */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-8">
            <div className="bg-[#8cc63f] p-8 md:p-12 w-full max-w-md shadow-2xl relative transform translate-y-6 md:translate-y-[35%] flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-black text-black uppercase leading-none mb-6 tracking-tight">
                Deal of the <br />Days.
              </h2>
              
              <div className="mb-8">
                <p className="text-black font-bold text-base mb-1">Optimum Nutrition Gold Standard</p>
                <div className="flex items-baseline justify-center space-x-3">
                  <span className="text-xl font-black text-black">Rs 14,000</span>
                  <span className="text-base text-gray-800 line-through decoration-black font-semibold">Rs 18,500</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex justify-center space-x-3 mb-10">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg mb-1 shadow-md">
                    {formatNumber(timeLeft.days)}
                  </div>
                  <span className="text-[10px] font-bold text-black uppercase">Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg mb-1 shadow-md">
                    {formatNumber(timeLeft.hours)}
                  </div>
                  <span className="text-[10px] font-bold text-black uppercase">Hrs</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg mb-1 shadow-md">
                    {formatNumber(timeLeft.minutes)}
                  </div>
                  <span className="text-[10px] font-bold text-black uppercase">Min</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg mb-1 shadow-md">
                    {formatNumber(timeLeft.seconds)}
                  </div>
                  <span className="text-[10px] font-bold text-black uppercase">Sec</span>
                </div>
              </div>

              <Link 
                href="/product" 
                className="inline-flex items-center px-6 py-3 bg-black text-white font-bold uppercase text-xs hover:bg-gray-800 transition-colors duration-300 group"
              >
                Shop Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
