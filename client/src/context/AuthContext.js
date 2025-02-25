import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Restore login state from localStorage
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");

    if (storedToken && storedRole) {
      console.log("Restoring user from localStorage:", { token: storedToken, role: storedRole });
      setUser({ token: storedToken, role: storedRole });
    }
  }, []);

  const login = (userData) => {
    console.log("Logging in user:", userData);
    setUser(userData); // ✅ Update state to trigger re-render

    localStorage.setItem("token", userData.token);
    localStorage.setItem("userRole", userData.role);
  };

  const logout = () => {s
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



