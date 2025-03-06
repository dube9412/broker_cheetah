import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://broker-cheetah-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          alert("Login successful");
          
          // ✅ Pass full role data clearly into your AuthContext
          login({
            email: email,
            isAdmin: data.isAdmin,
            isSuperAdmin: data.isSuperAdmin,
            role: data.role,
            lenderId: data.lenderId
          });
  
          // ✅ Redirect clearly based on role
          if (data.role === "superadmin" || data.role === "admin") {
            navigate("/admin-dashboard");
          } else if (data.role === "lender") {
            navigate("/lender/documents"); // <-- direct lenders to their new portal
          } else {
            navigate("/dashboard"); // regular user/broker
          }
        } else {
          alert("Login failed: " + data.message);
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        alert("An error occurred during login.");
      });
  };
  

  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:{" "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;

