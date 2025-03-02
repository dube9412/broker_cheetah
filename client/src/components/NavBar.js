import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./NavBar.css"; // Make sure this file includes the new styles

function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, isLender, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(null); // Track active dropdown

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

      <nav className="nav-links">
        {/* ✅ USER NAVBAR */}
        {isLoggedIn && !isAdmin && !isSuperAdmin && !isLender && (
          <>
            <Link to="/select-loan-type">Lender Search</Link>

            {/* ✅ Classes Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("classes")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Classes ▼</span>
              {showDropdown === "classes" && (
                <div className="dropdown-content">
                  <Link to="/hard-money-class">Hard Money Class</Link>
                </div>
              )}
            </div>

            {/* ✅ Calculators Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("calculators")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Calculators ▼</span>
              {showDropdown === "calculators" && (
                <div className="dropdown-content">
                  <Link to="/fix-and-flip-calculator">Fix and Flip</Link>
                  <span className="coming-soon">DSCR (Coming Soon)</span>
                </div>
              )}
            </div>

            {/* ✅ Tools Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("tools")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Tools ▼</span>
              {showDropdown === "tools" && (
                <div className="dropdown-content">
                  <Link to="/docs">Documents</Link>
                  <span className="coming-soon">Pipeline (Coming Soon)</span>
                  <span className="coming-soon">Help (Coming Soon)</span>
                  <span className="coming-soon">Knowledge Base (Coming Soon)</span>
                </div>
              )}
            </div>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* ✅ ADMIN NAVBAR */}
        {(isAdmin || isSuperAdmin) && (
          <>
            {/* ✅ Dashboards Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("dashboards")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Dashboards ▼</span>
              {showDropdown === "dashboards" && (
                <div className="dropdown-content">
                  <Link to="/dashboard">User Dashboard</Link>
                  <Link to="/admin-dashboard">Admin Dashboard</Link>
                  <Link to="/lender/dashboard">Lender Dashboard</Link>
                </div>
              )}
            </div>

            {/* ✅ Manage Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("manage")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Manage ▼</span>
              {showDropdown === "manage" && (
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

            {/* ✅ Tools Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("admin-tools")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Tools ▼</span>
              {showDropdown === "admin-tools" && (
                <div className="dropdown-content">
                  <Link to="/docs">Documents</Link>
                  <Link to="/admin/scrapers">Scrapers</Link>
                  <Link to="/admin/json-tools">JSON Import</Link>
                  <Link to="/admin/import-data">Import Data</Link>
                </div>
              )}
            </div>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* ✅ LENDER NAVBAR */}
        {isLender && (
          <>
            {/* ✅ Dashboards Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("lender-dashboards")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Dashboards ▼</span>
              {showDropdown === "lender-dashboards" && (
                <div className="dropdown-content">
                  <Link to="/dashboard">User Dashboard</Link>
                  <Link to="/lender/dashboard">Lender Dashboard</Link>
                </div>
              )}
            </div>

            {/* ✅ Uploads Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("uploads")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Uploads ▼</span>
              {showDropdown === "uploads" && (
                <div className="dropdown-content">
                  <Link to="/lender/logo-upload">Logo Upload</Link>
                  <Link to="/lender/documents">Documents</Link>
                </div>
              )}
            </div>

            <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white" }}>Logout</button>
          </>
        )}

        {/* ✅ Default Nav for Non-Logged In Users */}
        {!isLoggedIn && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>

            {/* ✅ Lender Dropdown */}
            <div className="dropdown" onMouseEnter={() => setShowDropdown("lender-login")} onMouseLeave={() => setShowDropdown(null)}>
              <span className="dropbtn">Lender ▼</span>
              {showDropdown === "lender-login" && (
                <div className="dropdown-content">
                  <Link to="/lender/login">Lender Login</Link>
                  <Link to="/lender/signup">Lender Signup</Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </div>
  );
}

export default NavBar;

