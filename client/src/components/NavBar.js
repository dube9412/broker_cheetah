import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"; // Ensure the correct path to the logo

const NavBar = () => {
  const { isLoggedIn, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // Force reload to home
  };

  return (
    <header style={headerStyle}>
      {/* Top Section - Logo & Title */}
      <div style={headerTop}>
        <img src={logo} alt="Broker Cheetah Logo" style={logoStyle} onClick={() => navigate("/")} />
        <h1 style={titleStyle}>Broker Cheetah</h1>
      </div>

      {/* Navigation Bar */}
      <nav style={navStyle}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={navLink}>Dashboard</Link>
            <Link to="/select-loan-type" style={navLink}>Lender Search</Link>
            {(isAdmin || isSuperAdmin) && (
              <Link to="/admin-dashboard" style={navLink}>Admin Dashboard</Link>
            )}
            <button onClick={handleLogout} style={logoutButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLink}>Login</Link>
            <Link to="/signup" style={navLink}>Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

// 🔹 Styles (Gold on Black)
const headerStyle = {
  background: "#000",
  paddingBottom: "10px",
  borderBottom: "3px solid gold",
  textAlign: "center",
};

const headerTop = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 0",
};

const logoStyle = {
  height: "60px",
  marginRight: "15px",
  cursor: "pointer",
};

const titleStyle = {
  fontSize: "2rem",
  color: "gold",
  fontFamily: "'Cinzel', serif", // Fancy font
  margin: 0,
};

const navStyle = {
  display: "flex",
  justifyContent: "center",
  padding: "10px 0",
  gap: "15px",
};

const navLink = {
  color: "gold",
  textDecoration: "none",
  fontSize: "1.2rem",
  fontWeight: "bold",
  padding: "5px 10px",
};

const logoutButton = {
  background: "gold",
  color: "black",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  fontSize: "1.2rem",
  fontWeight: "bold",
  borderRadius: "5px",
};

export default NavBar;

