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
      if (!isLoggedIn || userRole !== 'admin') {
        router.push('/403');
      }
    }, [isLoggedIn, userRole, router]);

    // Jika pengguna adalah admin, render komponen yang dibungkus
    if (isLoggedIn && userRole === 'admin') {
      return <WrappedComponent {...props} />;
    }

    // Tampilkan null atau loading selama proses redirect
    return null;
  };
};

// Cara menggunakan:
// export default withAdminProtection(UsersPage);