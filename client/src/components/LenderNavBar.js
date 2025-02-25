import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./LenderNavBar.css"; // ✅ Separate styling

function LenderNavBar() {
  return (
    <div className="lender-navbar-container">
      <div className="logo-container">
        <img src={logo} alt="Broker Cheetah Logo" />
        <h1>Lender Portal</h1>
      </div>

      <nav className="lender-nav-links">
        <Link to="/lender/dashboard">Portal Home</Link>
        <Link to="/lender/basic-info">Basic Info</Link>
        <Link to="/lender/loan-programs">Loan Programs</Link>
        <Link to="/lender/documents">Documents</Link>
      </nav>
    </div>
  );
}

export default LenderNavBar;
