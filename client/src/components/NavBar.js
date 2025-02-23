import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./NavBar.css";
import logo from "../assets/logo.png";

function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);

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
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {(isAdmin || isSuperAdmin) && (
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            )}
            <Link to="/select-loan-type">Lender Search</Link>
            <button onClick={() => {
              const subject = encodeURIComponent("Check out Broker Cheetah!");
              const body = encodeURIComponent("Hey, I found this great site for lender searches: https://brokercheetah.com");
              window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }}>
              Share
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>

      {isLoggedIn && (
        <div className="logout-container">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default NavBar;

