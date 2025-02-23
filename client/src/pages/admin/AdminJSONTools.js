import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminJSONTools = () => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div style={{ padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/admin")}>Admin Home</button>
        <button onClick={() => navigate("/admin/users")} style={{ marginLeft: "10px" }}>Users</button>
        <button onClick={() => navigate("/admin/lenders")} style={{ marginLeft: "10px" }}>Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} style={{ marginLeft: "10px" }}>Lender Users</button>
        <button onClick={() => navigate("/admin/help-tickets")} style={{ marginLeft: "10px" }}>Help Tickets</button>
        <button onClick={() => navigate("/admin/analytics")} style={{ marginLeft: "10px" }}>Analytics</button>
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