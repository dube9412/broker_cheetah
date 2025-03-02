import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LenderAuthContext } from "../context/LenderAuthContext"; // ✅ Import lender context
import logo from "../assets/logo.png";
import "./NavBar.css";

function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);
  const { isLenderLoggedIn, logoutLender } = useContext(LenderAuthContext);

  const [dropdown, setDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    logoutLender();
    window.location.href = "/";
  };

  // ✅ Unified Dashboard Dropdown
  const dashboardDropdown = (
    <div className="dropdown-content">
      <Link to="/dashboard">User Dashboard</Link>
      {isAdmin || isSuperAdmin ? <Link to="/admin-dashboard">Admin Dashboard</Link> : null}
      {isLenderLoggedIn ? <Link to="/lender/dashboard">Lender Dashboard</Link> : null}
    </div>
  );

  // ✅ User Navbar
  const userNav = (
    <>
      <Link to="/select-loan-type">Lender Search</Link>

      {/* Classes Dropdown */}
      <div className="dropdown" onMouseEnter={() => setDropdown("classes")} onMouseLeave={() => setDropdown(null)}>
        <span>Classes ▼</span>
        {dropdown === "classes" && (
          <div className="dropdown-content">
            <Link to="/hard-money-class">Hard Money Class</Link>
          </div>
        )}
      </div>

      {/* Calculators Dropdown */}
      <div className="dropdown" onMouseEnter={() => setDropdown("calculators")} onMouseLeave={() => setDropdown(null)}>
        <span>Calculators ▼</span>
        {dropdown === "calculators" && (
          <div className="dropdown-content">
            <Link to="/fix-and-flip-calculator">Fix & Flip Calculator</Link>
            <Link to="/dscr-calculator">DSCR Calculator</Link>
          </div>
        )}
      </div>

      {/* Tools Dropdown */}
      <div className="dropdown" onMouseEnter={() => setDropdown("tools")} onMouseLeave={() => setDropdown(null)}>
        <span>Tools ▼</span>
        {dropdown === "tools" && (
          <div className="dropdown-content">
            <Link to="/documents">Docs</Link>
            <span className="coming-soon">Pipeline (Coming Soon)</span>
            <span className="coming-soon">Help (Coming Soon)</span>
            <span className="coming-soon">Knowledge Base (Coming Soon)</span>
          </div>
        )}
      </div>
    </>
  );

  // ✅ Admin Navbar
  const adminNav = (
    <>
      {/* Dashboard Dropdown */}
      <div className="dropdown" onMouseEnter={() => setDropdown("dashboards")} onMouseLeave={() => setDropdown(null)}>
        <span>Dashboards ▼</span>
        {dropdown === "dashboards" && dashboardDropdown}
      </div>

      {/* Manage Dropdown */}
      <div className="dropdown" onMouseEnter={() => setDropdown("manage")} onMouseLeave={() => setDropdown(null)}>
        <span>Manage ▼</span>
        {dropdown === "manage" && (
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

      {/* Tools Dropdown */}
      <div className="dropdown" onMouseEnter={() => setDropdown("admin-tools")} onMouseLeave={() => setDropdown(null)}>
        <span>Tools ▼</span>
        {dropdown === "admin-tools" && (
          <div className="dropdown-content">
            <Link to="/documents">Docs</Link>
            <Link to="/admin/scrapers">Scrapers</Link>
            <Link to="/admin/json-tools">JSON Import</Link>
            <Link to="/admin/import-data">Import Data</Link>
          </div>
        )}
      </div>
    </>
  );

  // ✅ Lender Navbar
  const lenderNav = (
    <>
      {/* Dashboard Dropdown */}
      <div className="dropdown" onMouseEnter={() => setDropdown("lender-dashboards")} onMouseLeave={() => setDropdown(null)}>
        <span>Dashboard ▼</span>
        {dropdown === "lender-dashboards" && dashboardDropdown}
      </div>

      {/* Uploads Dropdown */}
      <div className="dropdown" onMouseEnter={() => setDropdown("uploads")} onMouseLeave={() => setDropdown(null)}>
        <span>Uploads ▼</span>
        {dropdown === "uploads" && (
          <div className="dropdown-content">
            <Link to="/lender/upload-logo">Logo</Link>
            <Link to="/lender/documents">Docs</Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="navbar-container">
      <div className="logo-container">
        <img src={logo} alt="Broker Cheetah Logo" />
        <h1>Broker Cheetah</h1>
      </div>

      <nav className="nav-links">
        {isLoggedIn && !isAdmin && !isSuperAdmin && !isLenderLoggedIn && userNav}
        {isAdmin || isSuperAdmin ? adminNav : null}
        {isLenderLoggedIn && !isAdmin && !isSuperAdmin ? lenderNav : null}
      </nav>

      <div className="logout-container">
        {isLoggedIn || isLenderLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>

            {/* Lender Dropdown */}
            <div className="dropdown" onMouseEnter={() => setDropdown("lender-login")} onMouseLeave={() => setDropdown(null)}>
              <span>Lender ▼</span>
              {dropdown === "lender-login" && (
                <div className="dropdown-content">
                  <Link to="/lender/login">Lender Login</Link>
                  <Link to="/lender/signup">Lender Signup</Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;

