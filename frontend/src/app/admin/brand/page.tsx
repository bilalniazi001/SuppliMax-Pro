'use client';

import React, { useState } from 'react';
import { brands } from '@/lib/brandVendorData';
import { Search, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function AdminBrandPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
            Manage <span className="text-[#629D23]">Brands</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your supplement brand partners and logos.</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-[#629D23] text-white font-bold rounded-lg hover:bg-[#2D3B29] transition-all shadow-lg hover:shadow-[#629D23]/30 uppercase tracking-wider text-sm">
          <Plus className="w-5 h-5 mr-2" /> Add New Brand
        </button>
      </div>

      <div className="flex items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input 
          type="text" 
          placeholder="Search brands..." 
          className="flex-1 p-2 outline-none text-gray-700 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBrands.map((brand) => (
          <div 
            key={brand.id} 
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="w-32 h-32 mb-4 bg-gray-50 rounded-xl p-4 flex items-center justify-center overflow-hidden border border-gray-50 group-hover:border-[#629D23]/30 transition-colors">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Logo'; }}
              />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#629D23] transition-colors">{brand.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 px-2">{brand.description}</p>

            <div className="mt-6 flex items-center gap-3 w-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <button className="flex-1 flex items-center justify-center py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-bold uppercase">
                <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
              </button>
              <button className="flex-1 flex items-center justify-center py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-bold uppercase">
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">No brands found matching your search.</p>
        </div>
      )}
    </div>
  );
}
