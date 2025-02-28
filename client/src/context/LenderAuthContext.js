// src/context/LenderAuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const LenderAuthContext = createContext();

export const LenderAuthProvider = ({ children }) => {
  const [isLenderLoggedIn, setIsLenderLoggedIn] = useState(false);
  const [lenderUser, setLenderUser] = useState(null); // You might not need this
  const [lenderUserId, setLenderUserId] = useState(null);

  // Restore login state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Correct key
    const storedLenderUserId = localStorage.getItem("lenderUserId");

    if (storedToken && storedLenderUserId) {
      setIsLenderLoggedIn(true);
      setLenderUserId(storedLenderUserId);
    }
  }, []);

    const loginLender = (data) => {
        setIsLenderLoggedIn(true);
        setLenderUserId(data.lenderUserId); // Assuming data contains lenderUserId
        setLenderUser(data); // ✅ Store full lender user object

        // Store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('lenderUserId', data.lenderUserId);
        localStorage.setItem("lenderUser", JSON.stringify(data)); // ✅ Store full data in localStorage
    };

    const logoutLender = () => {
        setIsLenderLoggedIn(false);
        setLenderUser(null);
        setLenderUserId(null);

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('lenderUserId');
    };

    return (
        <LenderAuthContext.Provider
            value={{
                isLenderLoggedIn,
                lenderUser, // Probably not needed on the dashboard
                lenderUserId,
                loginLender,
                logoutLender,
            }}
        >
            {children}
        </LenderAuthContext.Provider>
    );
};



