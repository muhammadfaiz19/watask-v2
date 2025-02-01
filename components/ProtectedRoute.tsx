// src/components/AdminProtectedRoute.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export const withAdminProtection = (WrappedComponent: React.ComponentType) => {
  return function AdminProtectedRoute(props: any) {
    const { isLoggedIn, userRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Cek apakah pengguna sudah login dan memiliki role admin
      if (!isLoggedIn) {
        router.push('/login');
      } else if (userRole !== 'admin') {
        router.push('/403');
      }
    }, [isLoggedIn, userRole, router]);

    // Jika pengguna adalah admin, render komponen yang dibungkus
    if (isLoggedIn && userRole === 'admin') {
      return <WrappedComponent {...props} />;
    }

    // Tampilkan loading
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  };
};
