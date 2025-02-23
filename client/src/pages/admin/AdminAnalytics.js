import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  <AdminNav />


  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/analytics");
        const data = await response.json();
        if (response.ok) {
          setAnalytics(data);
        } else {
          console.error("Failed to fetch analytics:", data.message);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [isAdmin, isSuperAdmin, navigate]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <nav className="admin-nav" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/admin-dashboard")} className="nav-button">Admin Home</button>
        <button onClick={() => navigate("/admin/users")} className="nav-button">Users</button>
        <button onClick={() => navigate("/admin/lenders")} className="nav-button">Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} className="nav-button">Lender Users</button>
        <button onClick={() => navigate("/admin/help-tickets")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/scraper-tools")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/json-import")} className="nav-button">JSON Import</button>
        <button onClick={() => navigate("/admin/import-data")} className="nav-button">Import Data</button>
        </nav>
      
      <h1>Admin Analytics</h1>
      <p>View site activity, user engagement, and income tracking.</p>

      {analytics ? (
        <div>
          <h2>Site Usage</h2>
          <p>Total Users: {analytics.totalUsers}</p>
          <p>Total Lenders: {analytics.totalLenders}</p>
          <p>Active Loans: {analytics.activeLoans}</p>
          <h2>Financial Data</h2>
          <p>Total Revenue: ${analytics.totalRevenue}</p>
          <p>Subscription Users: {analytics.subscriptionUsers}</p>
        </div>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
};

export default AdminAnalytics;