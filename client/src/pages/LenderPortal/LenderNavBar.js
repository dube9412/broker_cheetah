import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LenderAuthContext } from "../context/LenderAuthContext";

const LenderNavBar = () => {
    const navigate = useNavigate();
    const { logoutLender } = useContext(LenderAuthContext);

    return (
        <nav className="lender-navbar">
            <button onClick={() => navigate("/lender/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/lender/loan-programs")}>Manage Loan Programs</button>
            <button onClick={logoutLender} style={{ backgroundColor: "red", color: "white" }}>Logout</button>
        </nav>
    );
};

export default LenderNavBar;

