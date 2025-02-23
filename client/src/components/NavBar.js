import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./NavBar.css";


function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleShare = () => {
    const subject = encodeURIComponent("Check out Broker Cheetah!");
    const body = encodeURIComponent(
      "Hey, check out Broker Cheetah, a powerful lending platform: https://brokercheetah.com"
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#000",
        color: "gold",
        padding: "10px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Logo and Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <img
          src={logo}
          alt="Broker Cheetah"
          style={{ height: "60px", width: "auto", marginRight: "15px" }}
        />
        <span
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Georgia, serif",
          }}
        >
          Broker Cheetah
        </span>
      </div>

      {/* Navbar Links */}
      {isLoggedIn ? (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "15px",
              marginBottom: "10px",
            }}
          >
            <Link to="/dashboard" style={{ color: "gold", textDecoration: "none" }}>
              Dashboard
            </Link>
            {(isAdmin || isSuperAdmin) && (
              <Link to="/admin-dashboard" style={{ color: "gold", textDecoration: "none" }}>
                Admin Dashboard
              </Link>
            )}
            <Link to="/select-loan-type" style={{ color: "gold", textDecoration: "none" }}>
              Lender Search
            </Link>
            
          </div>

          {/* Logout Button on its own line */}
          <div style={{ marginTop: "10px" }}>
          <button
              onClick={handleShare}
              style={{
                backgroundColor: "gold",
                color: "#000",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Share
            </button>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#555",
                color: "gold",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <Link to="/login" style={{ color: "gold", textDecoration: "none" }}>
            Login
          </Link>
          <Link to="/signup" style={{ color: "gold", textDecoration: "none" }}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;

