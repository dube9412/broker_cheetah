import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminJSONTools = () => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  <AdminNav />


  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }
  }, [isAdmin, isSuperAdmin, navigate]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);
        setJsonData(jsonContent);
        alert("File uploaded and parsed successfully.");
      } catch (error) {
        alert("Error parsing JSON file.");
      } finally {
        setLoading(false);
      }
    };
  };

  const handleImport = async () => {
    if (!jsonData) {
      alert("No JSON data to import.");
      return;
    }
    try {
      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/import-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });
      if (response.ok) {
        alert("Data imported successfully.");
      } else {
        alert("Failed to import data.");
      }
    } catch (error) {
      alert("An error occurred during import.");
    }
  };

  return (
    <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <nav className="admin-nav" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/admin-dashboard")} className="nav-button">Admin Home</button>
        <button onClick={() => navigate("/admin/users")} className="nav-button">Users</button>
        <button onClick={() => navigate("/admin/lenders")} className="nav-button">Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} className="nav-button">Lender Users</button>
        <button onClick={() => navigate("/admin/help-tickets")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/analytics")} className="nav-button">Analytics</button>
        <button onClick={() => navigate("/admin/scrapers")} className="nav-button">Scrapers</button>
        <button onClick={() => navigate("/admin/import-data")} className="nav-button">Import Data</button>
        </nav>
      
      <h1>Admin JSON Tools</h1>
      <p>Upload and import JSON data into the system.</p>

      <input type="file" accept=".json" onChange={handleUpload} disabled={loading} />
      <button onClick={handleImport} disabled={!jsonData || loading} style={{ marginLeft: "10px" }}>
        Import JSON
      </button>
    </div>
  );
};

export default AdminJSONTools;