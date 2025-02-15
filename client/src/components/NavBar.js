import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const { isLoggedIn, isAdmin, isSuperAdmin, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // force reload to home
    // You might also clear tokens from localStorage, etc.
  };

  return (
    <nav style={{ margin: "1rem 0" }}>
      {isLoggedIn ? (
        <>
          {/* Logged-in user sees these links */}
          <Link to="/dashboard" style={{ marginRight: "1rem" }}>
            Home (Dashboard)
          </Link>
          {(isAdmin || isSuperAdmin) && (
  <Link to="/add-lender" style={{ marginRight: "1rem" }}>
    Add Lender (Admin Only)
  </Link>
          )}
          <Link to="/select-loan-type" style={{ marginRight: "1rem" }}>
            Lender Search
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          {/* Logged-out user sees these links */}
          <Link to="/login" style={{ marginRight: "1rem" }}>
            Login
          </Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;
