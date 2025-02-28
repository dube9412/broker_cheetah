import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LenderAuthContext } from "../context/LenderAuthContext";

const LenderProtectedRoutes = () => {
    const { isLenderLoggedIn } = useContext(LenderAuthContext);

    return isLenderLoggedIn ? <Outlet /> : <Navigate to="/lender/login" />;
};

export default LenderProtectedRoutes;

