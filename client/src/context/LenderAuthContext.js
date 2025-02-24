import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext"; // Import main auth context

export const LenderAuthContext = createContext();

export function LenderAuthProvider({ children }) {
  const { isAdmin, isSuperAdmin } = useContext(AuthContext); // ✅ Include Superadmins
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
        isLenderLoggedIn: isLenderLoggedIn || isAdmin || isSuperAdmin, // ✅ Superadmins get access too
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

