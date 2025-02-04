// client/src/context/AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null); // Add this line to define the user state variable

  const login = (user, adminFlag) => {
    setUser(user); // Set the user object in the state
    setIsLoggedIn(true);
    setIsAdmin(adminFlag);
  };

  const logout = () => {
    setUser(null); // Reset the user object in the state
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}