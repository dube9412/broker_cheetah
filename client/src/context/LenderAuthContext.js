import React, { createContext, useState } from "react";

export const LenderAuthContext = createContext();

export function LenderAuthProvider({ children }) {
  const [isLenderLoggedIn, setIsLenderLoggedIn] = useState(false);
  const [lenderUser, setLenderUser] = useState(null);
  const [lenderUserId, setLenderUserId] = useState(null);

  const loginLender = (lenderData) => {
    setIsLenderLoggedIn(true);
    setLenderUser(lenderData);
    setLenderUserId(lenderData.lenderUserId);
  };

  const logoutLender = () => {
    setIsLenderLoggedIn(false);
    setLenderUser(null);
    setLenderUserId(null);
  };

  return (
    <LenderAuthContext.Provider
      value={{
        isLenderLoggedIn, // ✅ Only tracks lender logins now
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


