import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LenderSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://broker-cheetah-backend.onrender.com/api/auth/signup-lender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Signup successful! Please log in.");
        navigate("/lender/login");
      } else {
        alert(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error during signup.");
    }
  };

  return (
    <div className="lender-signup" style={{ padding: "20px" }}>
      <h2>Lender Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/lender/login">Log In</Link></p>
    </div>
  );
};

export default LenderSignup;
