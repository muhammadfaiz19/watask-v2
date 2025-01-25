// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  userRole: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  protectRoute: (allowedRoles?: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (user) {
      const parsedUser = JSON.parse(user);

      setUsername(parsedUser.username);
      setUserRole(parsedUser.role);
    }
  }, []);

  const login = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setUsername(user.username);
    setUserRole(user.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername(null);
    setUserRole(null);
    router.push('/login');
  };

  const protectRoute = (allowedRoles?: string[]) => {
    if (!isLoggedIn) {
      router.push('/login');

      return false;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        router.push('/unauthorized');

        return false;
      }
    }

    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      userRole, 
      login, 
      logout, 
      protectRoute 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};