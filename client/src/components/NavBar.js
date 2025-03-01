import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./NavBar.css";

function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, user, logout } = useContext(AuthContext);
  const [showLenderDropdown, setShowLenderDropdown] = useState(false); // State for lender dropdown

  // ✅ Determine User Role
  const isLender = user?.role === "lender" || localStorage.getItem("role") === "lender";

  useEffect(() => {
    console.log("Navbar: Auth state changed:", { isLoggedIn, isAdmin, isSuperAdmin, isLender });
  }, [isLoggedIn, isAdmin, isSuperAdmin, isLender]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="navbar-container">
      <div className="logo-container">
        <img src={logo} alt="Broker Cheetah Logo" />
        <h1>Broker Cheetah</h1>
      </div>

      {isLoggedIn ? (
        <>
          <nav className="nav-links">
            {isAdmin || isSuperAdmin ? (
              <>
                <Link to="/admin-dashboard">Admin Dashboard</Link>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/lenders">Lenders</Link>
                <Link to="/admin/help-tickets">Help Tickets</Link>
              </>
            ) : isLender ? (
              <>
                <Link to="/lender/dashboard">Lender Dashboard</Link>
                <Link to="/lender/loan-programs">Loan Programs</Link>
                <Link to="/lender/documents">Documents</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/search/fixandflip">Fix & Flip</Link>
                <Link to="/select-loan-type">Loan Types</Link>
              </>
            )}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </nav>
        </>
      ) : (
        <nav className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>

          {/* Lender Dropdown */}
          <div
            className="dropdown"
            onMouseEnter={() => setShowLenderDropdown(true)}
            onMouseLeave={() => setShowLenderDropdown(false)}
            style={{ display: "inline-block", position: "relative", marginLeft: "10px" }}
          >
            <span style={{ cursor: "pointer", fontWeight: "bold" }}>Lender ▼</span>

            {showLenderDropdown && (
              <div className="dropdown-content"
                   style={{
                     position: "absolute",
                     top: "100%",
                     left: "0",
                     backgroundColor: "#fff",
                     border: "1px solid #ccc",
                     padding: "10px",
                     boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                     zIndex: "1000"
                   }}>
                <Link to="/lender/login" style={{ display: "block", padding: "5px" }}>Lender Login</Link>
                <Link to="/lender/signup" style={{ display: "block", padding: "5px" }}>Lender Signup</Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

export default NavBar;
