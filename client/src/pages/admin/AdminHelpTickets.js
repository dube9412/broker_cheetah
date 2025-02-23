import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminHelpTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  <AdminNav />


  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/help-tickets");
        const data = await response.json();
        if (response.ok) {
          setTickets(Array.isArray(data.tickets) ? data.tickets : []);
        } else {
          console.error("Failed to fetch help tickets:", data.message);
        }
      } catch (error) {
        console.error("Error fetching help tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [isAdmin, isSuperAdmin, navigate]);

  if (loading) return <div className="loading">Loading help tickets...</div>;

  return (
    <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <nav className="admin-nav" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/admin-dashboard")} className="nav-button">Admin Home</button>
        <button onClick={() => navigate("/admin/users")} className="nav-button">Users</button>
        <button onClick={() => navigate("/admin/lenders")} className="nav-button">Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} className="nav-button">Lender Users</button>
        <button onClick={() => navigate("/admin/analytics")} className="nav-button">Analytics</button>
        <button onClick={() => navigate("/admin/scraper-tools")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/json-import")} className="nav-button">JSON Import</button>
        <button onClick={() => navigate("/admin/import-data")} className="nav-button">Import Data</button>
        </nav>
      
      <h1 style={{ textAlign: "center", color: "#333" }}>Admin Help Tickets</h1>
      <p style={{ textAlign: "center", fontSize: "1.1em" }}>View and manage help tickets submitted by users.</p>

      <div className="help-ticket-table-container" style={{ display: "flex", justifyContent: "center" }}>
        <table border="1" cellPadding="6" className="help-ticket-table" style={{ width: "80%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#007BFF", color: "white" }}>
              <th>User</th>
              <th>Issue</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.userEmail}</td>
                  <td>{ticket.issue}</td>
                  <td>{ticket.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "10px", fontSize: "1.2em" }}>No help tickets available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHelpTickets;
