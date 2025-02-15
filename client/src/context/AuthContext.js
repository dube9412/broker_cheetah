// client/src/context/AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const login = (adminFlag, superAdminFlag) => {
    setIsLoggedIn(true);
    setIsAdmin(adminFlag);
    setIsSuperAdmin(superAdminFlag);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, isSuperAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}