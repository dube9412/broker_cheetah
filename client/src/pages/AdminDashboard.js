import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard" style={{ padding: "40px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1 style={{ color: "#333", marginBottom: "20px" }}>Admin Dashboard</h1>
      <p style={{ fontSize: "1.1em", marginBottom: "30px" }}>Manage users, lenders, and system settings.</p>

      <div className="admin-actions" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", justifyContent: "center" }}>
        <button onClick={() => navigate("/admin/users")} className="admin-button">Manage Users</button>
        <button onClick={() => navigate("/admin/lenders")} className="admin-button">Manage Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} className="admin-button">Lender Users</button>
        <button onClick={() => navigate("/admin/help-tickets")} className="admin-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/analytics")} className="admin-button">Analytics</button>
        <button onClick={() => navigate("/admin/scrapers")} className="admin-button">Scraper Tools</button>
        <button onClick={() => navigate("/admin/json-tools")} className="admin-button">JSON Import</button>
        <button onClick={() => navigate("/admin/import-data")} className="admin-button">Import Data</button>
      </div>
    </div>
  );
};

export default AdminDashboard;


