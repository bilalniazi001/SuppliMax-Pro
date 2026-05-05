"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface WelcomeCardProps {
  revenue: number;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ revenue }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50 flex justify-between items-center relative overflow-hidden h-full min-h-[220px]">
      <div className="relative z-10 space-y-3">
        <h2 className="text-2xl font-bold text-[#2D3B29]">
          Congratulations <span className="text-[#629D23]">{user?.name?.split(' ')[0]}!</span> 🎉
        </h2>
        <p className="text-gray-400 font-medium max-w-[200px]">
          Best seller of the month. You have done 100% more sales today.
        </p>
        <div className="pt-2">
          <h3 className="text-3xl font-extrabold text-[#629D23]">Rs. {revenue.toLocaleString()}</h3>
          <button className="mt-4 px-6 py-2.5 bg-[#629D23] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-[#2D3B29] transition-all">
            View Sales
          </button>
        </div>
      </div>
      
      <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-end justify-end p-4 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#629D23] fill-current">
          <path d="M44.7,-76.4C58.1,-69.2,70,-58.5,78.6,-45.4C87.2,-32.3,92.5,-16.1,91.8,-0.4C91.1,15.3,84.4,30.6,75,44.5C65.6,58.3,53.5,70.7,39,78.1C24.5,85.5,7.6,87.8,-9.4,85.4C-26.4,83,-43.5,75.9,-57.4,64.4C-71.3,53,-81.9,37.2,-86.3,20.2C-90.7,3.1,-88.9,-15.1,-81.3,-30.9C-73.7,-46.6,-60.3,-60,-45,-66.4C-29.8,-72.7,-14.9,-72.1,0.5,-72.9C15.9,-73.7,31.3,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>
  );
};

export default WelcomeCard;
