// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  // ✅ REMOVED: managerAllowed property
}

export default function ProtectedRoute({ 
  children, 
  adminOnly = false
  // ✅ REMOVED: managerAllowed
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin, isUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // ✅ Case 1: Not authenticated at all
      if (!isAuthenticated || !user) {
        if (adminOnly) {
          // Redirect to admin login for admin routes
          router.push('/login');
        } else {
          // Redirect to home for public routes
          router.push('/');
        }
        return;
      }

      // ✅ Case 2: Normal user trying to access admin routes
      if (isUser && adminOnly) {
        alert('Access Denied! Admin privileges required.');
        router.push('/');
        return;
      }

      // ✅ Case 3: Admin-only route but user is not admin
      if (adminOnly && !isAdmin) {
        alert('Access Denied! Admin privileges required.');
        router.push('/login');
        return;
      }
    }
  }, [user, loading, isAuthenticated, isAdmin, isUser, router, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  // ✅ Final security check before rendering
  if (!isAuthenticated || !user) {
    return null;
  }

  if (adminOnly && !isAdmin) {
    return null;
  }

  if (isUser && adminOnly) {
    return null;
  }

  return <>{children}</>;
}