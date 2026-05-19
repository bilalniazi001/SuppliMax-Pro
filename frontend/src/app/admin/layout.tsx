'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="flex min-h-screen bg-gray-100 relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          />
        )}

        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /> 
        
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <AdminTopBar onMenuClick={() => setIsSidebarOpen(true)} /> 
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}