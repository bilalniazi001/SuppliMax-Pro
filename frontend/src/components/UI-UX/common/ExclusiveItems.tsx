'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ExclusiveItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isExclusive: boolean;
}

interface ExclusiveItemsProps {
  // Prop ko optional ya ignore kar diya gaya hai for hardcoding
  initialData?: ExclusiveItem[]; 
}

// ✅ Hardcoded Data for display
const DUMMY_EXCLUSIVE_DATA: ExclusiveItem[] = [
    { 
        id: '1', 
        name: 'Whey Protein Powder: Advanced Mass Gainer', 
        description: 'Powerful blend for muscle recovery.', 
        price: 59.99, 
        isExclusive: true 
    },
    { 
        id: '2', 
        name: 'Pre-Workout Energy Boost & Focus', 
        description: 'Maximum energy and sustained focus.', 
        price: 34.50, 
        isExclusive: true 
    },
    { 
        id: '3', 
        name: 'BCAA Recovery Complex: Tropical Punch', 
        description: 'Essential amino acids for fast recovery.', 
        price: 24.99, 
        isExclusive: false 
    },
];


export default function ExclusiveItems({ initialData }: ExclusiveItemsProps) {
  // Data ab DUMMY_EXCLUSIVE_DATA se liya jaayega
  const exclusiveItems = DUMMY_EXCLUSIVE_DATA; 

  const backgroundImages = {
    large: "https://www.masculn.com/cdn/shop/articles/How_to_Take_Gym_Supplements_Safely_and_Effectively_1200x1200.jpg?v=1698324887",
    small1: "https://client.shivsofts.com/blog/uploads/1720764771.jpeg",  
    small2: "https://cdn.shopify.com/s/files/1/0005/5335/3267/files/Whey_c241938c-3633-47ea-a87f-8f72246b0d7c_480x480.jpg?v=1698293706"
  };

  const largeItem = exclusiveItems[0];
  const smallItem1 = exclusiveItems[1];
  const smallItem2 = exclusiveItems[2];
  
  // Fallback check
  if (!largeItem) {
    return (
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500">
          Hardcoded data is missing. Check DUMMY_EXCLUSIVE_DATA array.
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ==================== */}
          {/* LEFT SIDE - LARGE BANNER */}
          {/* ==================== */}
          <div className="relative overflow-hidden p-6 md:p-10 lg:p-12 h-[450px] md:h-[500px] shadow-lg bg-gray-900 border border-gray-800 ">
            {/* Background Image with img tag */}
            <img
              src={backgroundImages.large}
              alt="Exclusive Product Background"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            
            {/* Dark Overlay for Better Text Readability */}
            <div className="absolute inset-0 bg-black opacity-40"></div>
            
            {/* Content - Ab yeh show hoga */}
            <div className="relative z-10 max-w-[50%] h-full  flex flex-col justify-end ">
              <span className="text-sm font-semibold uppercase tracking-widest text-blue-300 mb-2 inline-block">
                {largeItem.isExclusive ? 'Exclusive Deal' : 'Special Product'}
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold leading-snug text-white mb-3">
                {largeItem.name}
              </h3>
              <p className="text-lg md:text-xl font-bold text-yellow-400 mb-6">
                ${largeItem.price.toFixed(2)}
              </p>
              <a
                href={`/product`}
                className="inline-flex items-center  space-x-2 px-6 py-3  bg-white text-gray-900 font-bold text-sm rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 w-fit"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ==================== */}
          {/* RIGHT SIDE - STACKED ITEMS */}
          {/* ==================== */}
          <div className="flex flex-col gap-6">
            
            {/* SMALL ITEM 1 */}
            {smallItem1 ? (
              <div className="relative overflow-hidden p-6 h-[213px] md:h-[238px] flex items-center justify-end shadow-lg bg-gray-900 border border-gray-800 ">
                {/* Background Image with img tag */}
                <img
                  src={backgroundImages.small1}
                  alt="Exclusive Product Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black opacity-70"></div>

                {/* Content */}
                <div className="relative z-10 text-white max-w-[50%] ml-auto text-right">
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-1 inline-block">
                    {smallItem1.isExclusive ? 'Exclusive Deal' : 'Special Offer'}
                  </span>
                  <h3 className="text-xl font-extrabold leading-snug text-white mb-2 line-clamp-2">
                    {smallItem1.name}
                  </h3>
                  <p className="text-lg font-bold text-yellow-400 mb-4">
                    ${smallItem1.price.toFixed(2)}
                  </p>
                  
                  <a
                    href={`/product`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-900 font-bold text-xs rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                  >
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              // Fallback
              <div className="relative overflow-hidden p-6 h-[213px] md:h-[238px] flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="relative z-10 text-white text-center">
                  <h3 className="text-xl font-bold mb-2">More Exclusive Deals</h3>
                  <p className="text-sm opacity-90">Coming soon...</p>
                </div>
              </div>
            )}

            {/* SMALL ITEM 2 */}
            {smallItem2 ? (
              <div className="relative overflow-hidden p-6 h-[213px] md:h-[238px] flex items-center shadow-lg bg-gray-900 border border-gray-800">
                {/* Background Image with img tag */}
                <img
                  src={backgroundImages.small2}
                  alt="Exclusive Product Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black opacity-40"></div>

                {/* Content */}
                <div className="relative z-10 max-w-[50%]">
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-1 inline-block">
                    {smallItem2.isExclusive ? 'Exclusive Deal' : 'Limited Stock'}
                  </span>
                  <h3 className="text-xl font-extrabold leading-snug text-white mb-2 line-clamp-2">
                    {smallItem2.name}
                  </h3>
                  <p className="text-lg font-bold text-yellow-400 mb-4">
                    ${smallItem2.price.toFixed(2)}
                  </p>
                  
                  <a
                    href={`/product`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-900 font-bold text-xs rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                  >
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              // Fallback
              <div className="relative overflow-hidden p-6 h-[213px] md:h-[238px] flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-600 shadow-lg">
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="relative z-10 text-white text-center">
                  <h3 className="text-xl font-bold mb-2">New Arrivals Coming</h3>
                  <p className="text-sm opacity-90">Stay tuned for more deals</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}