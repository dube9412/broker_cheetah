import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminScrapers = () => {
  const [scrapers, setScrapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  <AdminNav />


  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }

    const fetchScrapers = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/scrapers");
        const data = await response.json();
        if (response.ok) {
          setScrapers(Array.isArray(data.scrapers) ? data.scrapers : []);
        } else {
          console.error("Failed to fetch scrapers:", data.message);
        }
      } catch (error) {
        console.error("Error fetching scrapers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScrapers();
  }, [isAdmin, isSuperAdmin, navigate]);

  const handleRunScraper = async (id) => {
    if (!window.confirm("Are you sure you want to run this scraper? This may take a few minutes.")) return;
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/scrapers/${id}/run`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Scraper started successfully.");
      } else {
        alert("Failed to start scraper.");
      }
    } catch (error) {
      console.error("Error starting scraper:", error);
      alert("An error occurred while starting the scraper.");
    }
  };

  if (loading) return <div className="loading">Loading scrapers...</div>;

  return (
    <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <nav className="admin-nav" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/admin-dashboard")} className="nav-button">Admin Home</button>
        <button onClick={() => navigate("/admin/users")} className="nav-button">Users</button>
        <button onClick={() => navigate("/admin/lenders")} className="nav-button">Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} className="nav-button">Lender Users</button>
        <button onClick={() => navigate("/admin/help-tickets")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/analytics")} className="nav-button">Analytics</button>
        <button onClick={() => navigate("/admin/json-tools")} className="nav-button">JSON Tools</button>
        <button onClick={() => navigate("/admin/import-data")} className="nav-button">Import Data</button>
        </nav>
      
      <h1 style={{ textAlign: "center", color: "#333" }}>Admin Scrapers</h1>
      <p style={{ textAlign: "center", fontSize: "1.1em" }}>Run and manage scrapers for lender data.</p>

      <div className="scraper-table-container" style={{ display: "flex", justifyContent: "center" }}>
        <table border="1" cellPadding="6" className="scraper-table" style={{ width: "80%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#007BFF", color: "white" }}>
              <th>Scraper Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scrapers.length > 0 ? (
              scrapers.map((scraper) => (
                <tr key={scraper._id}>
                  <td>{scraper.name}</td>
                  <td>{scraper.description}</td>
                  <td>
                    <button onClick={() => handleRunScraper(scraper._id)} className="run-button">Run Scraper</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "10px", fontSize: "1.2em" }}>No scrapers available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminScrapers;
