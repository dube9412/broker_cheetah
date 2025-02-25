import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LenderSignup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Use the environment variable here!
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lender/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, phone, company }),
            });

            const data = await res.json();
            if (data.success) {
                // Corrected success message:
                alert("Signup successful! Your account is awaiting account assignment.");
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
        // ... (rest of your JSX remains the same) ...
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
          <input
            type="text"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/lender/login">Log In</Link>
        </p>
      </div>
    );
};

export default LenderSignup;

