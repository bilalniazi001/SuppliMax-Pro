'use client';

import React, { useState } from 'react';
import { brands } from '@/lib/brandVendorData';
import { Search, Plus, MoreVertical, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminVendorPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVendors = brands.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
            Manage <span className="text-[#629D23]">Vendors</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your supplement supply chain partners.</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-[#629D23] text-white font-bold rounded-lg hover:bg-[#2D3B29] transition-all shadow-lg hover:shadow-[#629D23]/30 uppercase tracking-wider text-sm">
          <Plus className="w-5 h-5 mr-2" /> Add New Vendor
        </button>
      </div>

      <div className="flex items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input 
          type="text" 
          placeholder="Search vendors..." 
          className="flex-1 p-2 outline-none text-gray-700 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
        {filteredVendors.map((vendor) => (
          <div 
            key={vendor.id} 
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
          >
            <div className="p-8 flex items-start gap-6">
              <div className="w-24 h-24 bg-gray-50 rounded-2xl p-3 flex items-center justify-center border border-gray-50 group-hover:border-[#629D23]/30 transition-colors shrink-0">
                <img 
                  src={vendor.logo} 
                  alt={vendor.name} 
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Vendor'; }}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#629D23] transition-colors">{vendor.name}</h3>
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-2 text-[#629D23]" />
                    contact@{vendor.id}.com
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-2 text-[#629D23]" />
                    +92 300 1234567
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-[#629D23]" />
                    Karachi, Pakistan
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Active Contracts: <span className="text-gray-900">5</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">No vendors found matching your search.</p>
        </div>
      )}
    </div>
  );
}
