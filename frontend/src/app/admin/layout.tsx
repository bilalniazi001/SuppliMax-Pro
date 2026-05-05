// app/(admin)/layout.tsx
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // ✅ UPDATED: Only adminOnly, no managerAllowed
    <ProtectedRoute adminOnly={true}>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar /> 
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <AdminTopBar/> 
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}