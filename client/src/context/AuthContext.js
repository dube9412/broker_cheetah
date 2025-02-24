// client/src/context/AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLender, setIsLender] = useState(false);
  const [user, setUser] = useState(null);


  const login = (userData) => {
    setIsLoggedIn(true);
    setIsAdmin(userData.isAdmin);
    setIsSuperAdmin(userData.isSuperAdmin);
    setIsLender(userData.role === 'lender');
    setUser(userData);
  };
  

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setIsLender(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      isAdmin, 
      isSuperAdmin, 
      isLender,
      user,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}