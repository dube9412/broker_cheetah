import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css"; // Reuse the same styles as Dashboard

function LoanTypeSelection() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/search/${type}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Select a Loan Type</h1>
      <p className="dashboard-subtitle">Choose the type of loan you want to search for:</p>

      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => handleSelect("fixandflip")}>
          <h3>Fix and Flip</h3>
          <p>Find lenders for your fix and flip projects.</p>
        </div>

        <div className="dashboard-card" onClick={() => handleSelect("dscr")}>
          <h3>DSCR</h3>
          <p>Search for lenders offering DSCR loans.</p>
        </div>

        <div className="dashboard-card" onClick={() => handleSelect("groundup")}>
          <h3>Ground Up</h3>
          <p>Explore lenders for ground-up construction projects.</p>
        </div>

        <div className="dashboard-card" onClick={() => handleSelect("stabilizedbridge")}>
          <h3>Stabilized Bridge</h3>
          <p>Find lenders for stabilized bridge loans.</p>
        </div>

        <div className="dashboard-card" onClick={() => handleSelect("portfolio")}>
          <h3>Portfolio</h3>
          <p>Search for lenders offering portfolio loans.</p>
        </div>
      </div>

      <footer className="dashboard-footer">
        © {new Date().getFullYear()} Broker Cheetah. All rights reserved.
      </footer>
    </div>
  );
}

export default LoanTypeSelection;
