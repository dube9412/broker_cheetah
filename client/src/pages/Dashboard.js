// Dashboard.js

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css";

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        {user?.firstName ? `${user.firstName} Welcome to Your Dashboard` : "Welcome to Your Dashboard"}
      </h1>
      <p className="dashboard-subtitle">Select an option below to get started:</p>

      <div className="dashboard-cards">
        <Link to="/lender-search" className="dashboard-card">
          <h3>Lender Search</h3>
          <p>Find the perfect hard money lender for your deal.</p>
        </Link>

        <Link to="/hard-money-class" className="dashboard-card">
          <h3>Hard Money Lending Class</h3>
          <p>Master hard money lending fundamentals.</p>
        </Link>

        <Link to="/fix-and-flip-calculator" className="dashboard-card">
          <h3>Fix & Flip Calculator</h3>
          <p>Analyze your deals with precision.</p>
        </Link>

        <Link to ="/pipeline" className="dashboard-card">
          <h3>Pipeline</h3>
          <p>Take a deal from the Quote to Submission</p>
        </Link>

        <Link to ="/help-tickets" className="dashboard-card">
          <h3>Help</h3>
          <p>Need assistance? Get help here.</p>
        </Link>
          

        <div className="dashboard-card disabled">
          <h3>Knowledge Base</h3>
          <p>Coming soon</p>
        </div>
      </div>

      <footer className="dashboard-footer">
        © {new Date().getFullYear()} Broker Cheetah. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;
