import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false); // New state for opt-in
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("Broker"); // Default to "Broker"

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://broker-cheetah-backend.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, marketingOptIn, firstName, lastName, userType }), // Include new fields
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Sign up successful");
          navigate("/login");
        } else {
          alert("Sign up failed");
        }
      });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:{" "}
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Last Name:{" "}
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <br />

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

        <label>
          User Type:{" "}
          <input
            type="radio"
            value="Broker"
            checked={userType === "Broker"}
            onChange={(e) => setUserType(e.target.value)}
          />{" "}
          Broker
          <input
            type="radio"
            value="Investor"
            checked={userType === "Investor"}
            onChange={(e) => setUserType(e.target.value)}
          />{" "}
          Investor
          <input
            type="radio"
            value="Other"
            checked={userType === "Other"}
            onChange={(e) => setUserType(e.target.value)}
          />{" "}
          Other
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
          />
          I want to receive updates about new features and releases.
        </label>
        <br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;

