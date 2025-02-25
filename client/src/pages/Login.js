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
      .then(res => res.json())
      .then(data => {
        console.log("Login API Response:", data); // ✅ Log response
  
        if (data.success) {
          alert("Login successful");
          console.log("Storing user:", {
            email: email,
            isAdmin: data.isAdmin,
            isSuperAdmin: data.isSuperAdmin,
            role: data.role,
            lenderId: data.lenderId
          });
  
          // ✅ Ensure login function updates AuthContext
          login({
            email: email,
            isAdmin: data.isAdmin,
            isSuperAdmin: data.isSuperAdmin,
            role: data.role,
            lenderId: data.lenderId
          });
  
          // ✅ Check if navigation is actually happening
          if (data.role === "superadmin" || data.role === "admin") {
            console.log("Redirecting to Admin Dashboard...");
            navigate("/admin-dashboard");
          } else if (data.role === "lender") {
            console.log("Redirecting to Lender Dashboard...");
            navigate("/lender/documents");
          } else {
            console.log("Redirecting to User Dashboard...");
            navigate("/dashboard");
          }
        } else {
          alert("Login failed: " + data.message);
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        alert("An error occurred during login: " + err.message);
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

