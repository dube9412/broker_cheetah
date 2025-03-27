import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext"; // ✅ Import Main Auth Context
import { useNavigate } from "react-router-dom"; // Add this import

export const LenderAuthContext = createContext();

export const LenderAuthProvider = ({ children }) => {
  const [lenderUser, setLenderUser] = useState(null);
  const isLenderLoggedIn = !!lenderUser;
  const { login } = useContext(AuthContext); // ✅ Use AuthContext to update the main auth state
  const navigate = useNavigate(); // Add this hook

  // ✅ Restore login state from LocalStorage
  useEffect(() => {
    const storedLenderToken = localStorage.getItem("lenderToken");
    const storedLenderRole = localStorage.getItem("lenderRole");

    if (storedLenderToken && storedLenderRole) {
      setLenderUser({ token: storedLenderToken, role: storedLenderRole });
    }
  }, []);

  const loginLender = (lenderData) => {
    setLenderUser(lenderData);
    localStorage.setItem("lenderToken", lenderData.token);
    localStorage.setItem("lenderRole", lenderData.role);

    // ✅ Update AuthContext so NavBar re-renders correctly
    login({
      token: lenderData.token,
      role: "lender",
    });
  };

  const logoutLender = () => {
    setLenderUser(null);
    localStorage.removeItem("lenderToken");
    localStorage.removeItem("lenderRole");

    navigate("/"); // Redirect to Home.js
  };

  return (
    <LenderAuthContext.Provider value={{ lenderUser, isLenderLoggedIn, loginLender, logoutLender }}>
      {children}
    </LenderAuthContext.Provider>
  );
};

export const useLenderAuth = () => useContext(LenderAuthContext);




