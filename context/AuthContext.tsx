// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  userRole: string | null;
  user: any; // Add user property
  setUser: (user: any) => void; // Add setUser function
  login: (token: string, user: any) => void;
  logout: () => void;
  protectRoute: (allowedRoles?: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Add user state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (user) {
      const parsedUser = JSON.parse(user);

      setUser(parsedUser); // Set user if found in localStorage
      setUsername(parsedUser.username);
      setUserRole(parsedUser.role);
    }
  }, []);

  const login = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setUser(user); // Set user on login
    setUsername(user.username);
    setUserRole(user.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null); // Clear user on logout
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
      user, // Provide user in context
      setUser, // Provide setUser in context
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
