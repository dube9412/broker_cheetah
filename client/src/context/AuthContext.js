import React, { createContext, useState, useEffect } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restore login state from localStorage
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");

    if (storedToken) {
      setUser({ token: storedToken, role: storedRole });
    }
  }, []);

  const login = (userData) => {
    console.log("Logging in user:", userData);
    setUser(userData); // ✅ Ensure this updates state properly

    localStorage.setItem("token", userData.token);
    localStorage.setItem("userRole", userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


