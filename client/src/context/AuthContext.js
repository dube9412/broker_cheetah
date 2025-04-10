import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user; // ✅ Boolean for login state
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";
  const isLender = user?.role === "lender";

  useEffect(() => {
    // ✅ Restore login state from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Restoring user from localStorage:", parsedUser);
      setUser({ ...parsedUser, token: storedToken });
    }
  }, []);

  const login = (userData) => {
    console.log("Logging in user:", userData);
    console.log("🔍 Login Response Data:", userData);
    if (!userData.token) {
      console.error("❌ No token received in login response.");
    }
    setUser(userData); // ✅ Update state to trigger re-render

    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData)); // Store full user data
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error requesting password reset:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAdmin,
        isSuperAdmin,
        isLender,
        login,
        logout,
        requestPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};