import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext"; // ✅ Import Main Auth Context

export const LenderAuthContext = createContext();

export const LenderAuthProvider = ({ children }) => {
  const [isLenderLoggedIn, setIsLenderLoggedIn] = useState(false);
  const [lenderUser, setLenderUser] = useState(null);
  const [lenderUserId, setLenderUserId] = useState(null);
  const { login } = useContext(AuthContext); // ✅ Use AuthContext to update the main auth state

  // ✅ Restore login state from LocalStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedLenderUserId = localStorage.getItem("lenderUserId");

    if (storedToken && storedLenderUserId) {
      setIsLenderLoggedIn(true);
      setLenderUserId(storedLenderUserId);
    }
  }, []);

  const loginLender = (data) => {
    setIsLenderLoggedIn(true);
    setLenderUserId(data.lenderUserId);
    setLenderUser(data);

    // ✅ Store in LocalStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("lenderUserId", data.lenderUserId);
    localStorage.setItem("role", "lender"); // ✅ Save role

    // ✅ Update AuthContext so NavBar re-renders correctly
    login({
      token: data.token,
      role: "lender",
    });
  };

  const logoutLender = () => {
    setIsLenderLoggedIn(false);
    setLenderUser(null);
    setLenderUserId(null);

    // ✅ Clear LocalStorage
    localStorage.removeItem("token");
    localStorage.removeItem("lenderUserId");
    localStorage.removeItem("role");
  };

  return (
    <LenderAuthContext.Provider value={{ isLenderLoggedIn, lenderUser, lenderUserId, loginLender, logoutLender }}>
      {children}
    </LenderAuthContext.Provider>
  );
};