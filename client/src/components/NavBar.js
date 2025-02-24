import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LenderAuthContext } from "../context/LenderAuthContext";
import logo from "../assets/logo.png";

function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);
  const { isLenderLoggedIn, logoutLender } = useContext(LenderAuthContext);

  const handleLogout = () => {
    logout();
    logoutLender();
    window.location.href = "/";
  };

  const handleShare = () => {
    const subject = encodeURIComponent("Check out Broker Cheetah!");
    const body = encodeURIComponent("Hey, check out Broker Cheetah: https://brokercheetah.com");
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
            
            {/* ✅ Admins & Superadmins get Admin Dashboard */}
            {(isAdmin || isSuperAdmin) && <Link to="/admin-dashboard">Admin Dashboard</Link>}
            
            {/* ✅ Show Lender Portal link for Lenders, Admins, and Superadmins */}
            {(isLenderLoggedIn || isAdmin || isSuperAdmin) && <Link to="/lender/dashboard">Lender Portal</Link>}
            
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
        </nav>
      )}
    </div>
  );
}

export default NavBar;



