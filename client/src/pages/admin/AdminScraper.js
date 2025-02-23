import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminScrapers = () => {
  const [scrapers, setScrapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }

    const fetchScrapers = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/scrapers");
        const data = await response.json();
        if (response.ok) {
          setScrapers(data.scrapers);
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
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/scrapers/${id}/run`, {
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

  if (loading) return <div>Loading scrapers...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/admin")}>Admin Home</button>
        <button onClick={() => navigate("/admin/users")} style={{ marginLeft: "10px" }}>Users</button>
        <button onClick={() => navigate("/admin/lenders")} style={{ marginLeft: "10px" }}>Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} style={{ marginLeft: "10px" }}>Lender Users</button>
        <button onClick={() => navigate("/admin/help-tickets")} style={{ marginLeft: "10px" }}>Help Tickets</button>
        <button onClick={() => navigate("/admin/analytics")} style={{ marginLeft: "10px" }}>Analytics</button>
      </nav>
      
      <h1>Admin Scrapers</h1>
      <p>Run and manage scrapers for lender data.</p>

      <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
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
                  <button onClick={() => handleRunScraper(scraper._id)}>Run Scraper</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No scrapers available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminScrapers;