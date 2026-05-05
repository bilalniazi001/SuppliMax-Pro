"use client";

import React from 'react';
import Image from 'next/image';

interface PopularProductsProps {
  products: any[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({ products }) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50 h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#2D3B29]">Popular Products</h2>
      </div>

      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/50'} 
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#2D3B29] truncate">{product.name}</h4>
              <p className="text-xs text-gray-400 font-medium">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-[#2D3B29]">Rs. {product.price.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-[#629D23] uppercase">{product.totalSold} Sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
