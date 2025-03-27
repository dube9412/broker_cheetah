import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LenderAuthContext } from "../context/LenderAuthContext";
import logo from "../assets/logo.png";
import "./NavBar.css";

function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);
  const { isLenderLoggedIn, logoutLender } = useContext(LenderAuthContext);
  const navigate = useNavigate();
  
  const [showLenderDropdown, setShowLenderDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showCalcDropdown, setShowCalcDropdown] = useState(false);
  const [showManageDropdown, setShowManageDropdown] = useState(false);

  useEffect(() => {
    console.log("Navbar: Auth state changed:", { isLoggedIn, isAdmin, isSuperAdmin, isLenderLoggedIn });
  }, [isLoggedIn, isAdmin, isSuperAdmin, isLenderLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home after logout
  };

  const handleLenderLogout = () => {
    logoutLender();
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div className="navbar-container">
      <div className="logo-container">
        <img src={logo} alt="Broker Cheetah Logo" />
        <h1>Broker Cheetah</h1>
      </div>

      {isAdmin || isSuperAdmin ? (
        /** 🔥 ADMIN NAVBAR **/
        <>
          <nav className="nav-links">
            <div
              className="dropdown"
              onMouseEnter={() => setShowManageDropdown(true)}
              onMouseLeave={() => setShowManageDropdown(false)}
            >
              <span className="dropdown-title">Dashboards ▼</span>
              {showManageDropdown && (
                <div className="dropdown-content">
                  <Link to="/dashboard">User Dashboard</Link>
                  <Link to="/admin-dashboard">Admin Dashboard</Link>
                  <Link to="/lender/dashboard">Lender Dashboard</Link>
                </div>
              )}
            </div>

            <div
              className="dropdown"
              onMouseEnter={() => setShowClassDropdown(true)}
              onMouseLeave={() => setShowClassDropdown(false)}
            >
              <span className="dropdown-title">Manage ▼</span>
              {showClassDropdown && (
                <div className="dropdown-content">
                  <Link to="/admin/users">Users</Link>
                  <Link to="/admin/lenders">Lenders</Link>
                  <Link to="/admin/lender-users">Lender Users</Link>
                  <Link to="/admin/lender-approvals">Approve Lender Edits</Link>
                </div>
              )}
            </div>

            <Link to="/admin/analytics">Analytics</Link>
            <Link to="/admin/help-tickets">Help Tickets</Link>

            <div
              className="dropdown"
              onMouseEnter={() => setShowToolsDropdown(true)}
              onMouseLeave={() => setShowToolsDropdown(false)}
            >
              <span className="dropdown-title">Tools ▼</span>
              {showToolsDropdown && (
                <div className="dropdown-content">
                  <Link to="/admin/documents">Docs</Link>
                  <Link to="/admin/scrapers">Scrapers</Link>
                  <Link to="/admin/json-tools">JSON Import</Link>
                  <Link to="/admin/import-data">Import Data</Link>
                </div>
              )}
            </div>
          </nav>

          <div className="logout-container">
            <button onClick={handleLogout}>Logout</button> // Redirect handled in AuthContext
          </div>
        </>
      ) : isLenderLoggedIn ? (
        /** 🔥 LENDER NAVBAR **/
        <>
          <nav className="nav-links">
            <Link to="/lender/dashboard">Lender Dashboard</Link>
            <Link to="/lender/documents">Upload Docs</Link>
            <Link to="/lender/loan-programs">Manage Loan Programs</Link>
          </nav>

          <div className="logout-container">
            <button onClick={handleLenderLogout}>Logout</button> // Redirect handled in LenderAuthContext
          </div>
        </>
      ) : isLoggedIn ? (
        /** 🔥 USER NAVBAR **/
        <>
          <nav className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/select-loan-type">Lender Search</Link>

            <div
              className="dropdown"
              onMouseEnter={() => setShowClassDropdown(true)}
              onMouseLeave={() => setShowClassDropdown(false)}
            >
              <span className="dropdown-title">Classes ▼</span>
              {showClassDropdown && (
                <div className="dropdown-content">
                  <Link to="/hard-money-class">Hard Money Class</Link>
                </div>
              )}
            </div>

            <div
              className="dropdown"
              onMouseEnter={() => setShowCalcDropdown(true)}
              onMouseLeave={() => setShowCalcDropdown(false)}
            >
              <span className="dropdown-title">Calculators ▼</span>
              {showCalcDropdown && (
                <div className="dropdown-content">
                  <Link to="/fix-and-flip-calculator">Fix & Flip Calculator</Link>
                  <Link to="/dscr-calculator">DSCR Calculator</Link>
                </div>
              )}
            </div>

            <div
              className="dropdown"
              onMouseEnter={() => setShowToolsDropdown(true)}
              onMouseLeave={() => setShowToolsDropdown(false)}
            >
              <span className="dropdown-title">Tools ▼</span>
              {showToolsDropdown && (
                <div className="dropdown-content">
                  <Link to="/history">History</Link>
                  <Link to="admin/documents">Docs</Link>
                  <Link to="/help">Help</Link>
                  <Link to="/knowledge-base">Knowledge Base</Link>
                </div>
              )}
            </div>
          </nav>

          <div className="logout-container">
            <button onClick={handleLogout}>Logout</button> // Redirect handled in AuthContext
          </div>
        </>
      ) : (
        /** 🔥 PUBLIC (NOT LOGGED IN) NAVBAR **/
        <nav className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>

          <div
            className="dropdown"
            onMouseEnter={() => setShowLenderDropdown(true)}
            onMouseLeave={() => setShowLenderDropdown(false)}
          >
            <span className="dropdown-title">Lender ▼</span>
            {showLenderDropdown && (
              <div className="dropdown-content">
                <Link to="/lender/login">Lender Login</Link>
                <Link to="/lender/signup">Lender Signup</Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

export default NavBar;
