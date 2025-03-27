import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // Reuse the same styles as Dashboard

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminActions = [
    { label: "Manage Users", path: "/admin/users" },
    { label: "Manage Lenders", path: "/admin/lenders" },
    { label: "Lender Users", path: "/admin/lender-users" },
    { label: "Approve Lender Edits", path: "/admin/lender-approvals" },
    { label: "Help Tickets", path: "/admin/help-tickets" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Scraper Tools", path: "/admin/scrapers" },
    { label: "JSON Import", path: "/admin/json-tools" },
    { label: "Import Data", path: "/admin/import-data" },
    { label: "Documents", path: "/admin/documents" },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-subtitle">Manage users, lenders, and system settings:</p>

      <div className="dashboard-cards">
        {adminActions.map((action, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={() => navigate(action.path)}
          >
            <h3>{action.label}</h3>
          </div>
        ))}
      </div>

      <footer className="dashboard-footer">
        © {new Date().getFullYear()} Broker Cheetah. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;


