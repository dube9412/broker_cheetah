import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./NavBar.css";

function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);
  const [showLenderDropdown, setShowLenderDropdown] = useState(false); // State for lender dropdown

  useEffect(() => {
    console.log("Navbar: Auth state changed:", { isLoggedIn, isAdmin, isSuperAdmin });
  }, [isLoggedIn, isAdmin, isSuperAdmin]); 
  

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleShare = () => {
    const subject = encodeURIComponent("Check out Broker Cheetah!");
    const body = encodeURIComponent(
      "Hey, check out Broker Cheetah: https://brokercheetah.com"
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
            <Link to="/dashboard">Dashboard</Link>
            {(isAdmin || isSuperAdmin) && (
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            )}
            <Link to="/select-loan-type">Lender Search</Link>
            <button onClick={handleShare}>Share</button>
          </nav>

          <div className="logout-container">
            <button onClick={handleLogout}>Logout</button>
          </div>
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



