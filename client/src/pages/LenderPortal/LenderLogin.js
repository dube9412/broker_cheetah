import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LenderAuthContext } from "../../context/LenderAuthContext";

const LenderLogin = () => {
  const { loginLender } = useContext(LenderAuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://broker-cheetah-backend.onrender.com/api/lender/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        loginLender({
          email,
          lenderUserId: data.lenderUserId,
        });

        navigate("/lender/dashboard");
      } else {
        alert("Login failed: Unauthorized or invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error during login.");
    }
  };

  return (
    <div className="lender-login" style={{ padding: "20px" }}>
      <h2>Lender Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/lender/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LenderLogin;


