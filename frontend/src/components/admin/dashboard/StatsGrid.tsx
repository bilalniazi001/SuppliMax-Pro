"use client";

import React from 'react';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';

interface StatsGridProps {
  revenue: number;
  orders: number;
  products: number;
  users: number;
}

const StatMiniCard = ({ title, value, icon, color, bgColor }: { title: string, value: string, icon: React.ReactNode, color: string, bgColor: string }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-50 border border-gray-50 flex items-center gap-4 transition-all hover:scale-[1.03]">
    <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${color} shadow-sm`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-extrabold text-[#2D3B29]">{value}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{title}</p>
    </div>
  </div>
);

const StatsGrid: React.FC<StatsGridProps> = ({ revenue, orders, products, users }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      <StatMiniCard 
        title="Revenue" 
        value={`Rs. ${revenue.toLocaleString()}`} 
        icon={<TrendingUp size={24} />} 
        color="text-[#629D23]" 
        bgColor="bg-green-50" 
      />
      <StatMiniCard 
        title="Orders" 
        value={orders.toLocaleString()} 
        icon={<ShoppingCart size={24} />} 
        color="text-blue-600" 
        bgColor="bg-blue-50" 
      />
      <StatMiniCard 
        title="Products" 
        value={products.toLocaleString()} 
        icon={<Package size={24} />} 
        color="text-orange-500" 
        bgColor="bg-orange-50" 
      />
      <StatMiniCard 
        title="Customers" 
        value={users.toLocaleString()} 
        icon={<Users size={24} />} 
        color="text-purple-600" 
        bgColor="bg-purple-50" 
      />
    </div>
  );
};

export default StatsGrid;
