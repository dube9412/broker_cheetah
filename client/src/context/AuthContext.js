import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";
  const isLender = user?.role === "lender";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");

    if (storedToken && storedRole) {
      console.log("Restoring user from localStorage:", { token: storedToken, role: storedRole });
      setUser({ token: storedToken, role: storedRole });
    }
  }, []);

  const login = (userData) => {
    console.log("Logging in user:", userData);
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userRole", userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, isSuperAdmin, isLender, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



