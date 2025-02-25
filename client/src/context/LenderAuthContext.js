import React, { createContext, useState, useEffect } from "react";

export const LenderAuthContext = createContext();

export function LenderAuthProvider({ children }) {
  const [isLenderLoggedIn, setIsLenderLoggedIn] = useState(false);
  const [lenderUser, setLenderUser] = useState(null);
  const [lenderUserId, setLenderUserId] = useState(null);

  // ✅ Restore login state from localStorage when the app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("lenderToken");
    const storedRole = localStorage.getItem("lenderRole");
    const storedLenderUserId = localStorage.getItem("lenderUserId");

    if (storedToken && storedRole === "lender") {
      setIsLenderLoggedIn(true);
      setLenderUserId(storedLenderUserId);
    }
  }, []);

  const loginLender = (lenderData) => {
    setIsLenderLoggedIn(true);
    setLenderUser(lenderData);
    setLenderUserId(lenderData.lenderUserId);

    // ✅ Store in localStorage so the session persists
    localStorage.setItem("lenderToken", lenderData.token);
    localStorage.setItem("lenderRole", lenderData.role);
    localStorage.setItem("lenderUserId", lenderData.lenderUserId);
  };

  const logoutLender = () => {
    setIsLenderLoggedIn(false);
    setLenderUser(null);
    setLenderUserId(null);

    // ✅ Remove from localStorage on logout
    localStorage.removeItem("lenderToken");
    localStorage.removeItem("lenderRole");
    localStorage.removeItem("lenderUserId");
  };

  return (
    <LenderAuthContext.Provider
      value={{
        isLenderLoggedIn, // ✅ Now properly tracks lender login
        lenderUser,
        lenderUserId,
        loginLender,
        logoutLender,
      }}
    >
      {children}
    </LenderAuthContext.Provider>
  );
}



