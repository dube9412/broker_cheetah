import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminJSONTools = () => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lenders, setLenders] = useState([]);
  const [selectedLenderId, setSelectedLenderId] = useState("");
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  <AdminNav />

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }

    // Fetch list of lenders
    const fetchLenders = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
        const data = await response.json();
        if (response.ok) {
          setLenders(data.lenders);
        } else {
          alert("Failed to fetch lenders.");
        }
      } catch (error) {
        console.error("Error fetching lenders:", error);
      }
    };

    fetchLenders();
  }, [isAdmin, isSuperAdmin, navigate]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);

        // Attach selected lender ID to each program
        const updatedData = Array.isArray(parsedData)
          ? parsedData.map(item => ({ ...item, lender: selectedLenderId }))
          : [{ ...parsedData, lender: selectedLenderId }];

        setJsonData(updatedData);
        alert("File uploaded and parsed successfully.");
      } catch (error) {
        alert("Error parsing JSON file.");
      } finally {
        setLoading(false);
      }
    };
  };

  const handleImport = async () => {
    if (!jsonData || !selectedLenderId) {
      alert("Please select a lender and upload a JSON file.");
      return;
    }
    try {
      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/import-json", {
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
      <h1>Admin JSON Tools</h1>
      <p>Upload and import JSON data into the system.</p>

      <label>Select Lender:</label>
      <select
        value={selectedLenderId}
        onChange={(e) => setSelectedLenderId(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        <option value="">-- Choose a lender --</option>
        {lenders.map((lender) => (
          <option key={lender._id} value={lender._id}>
            {lender.name}
          </option>
        ))}
      </select>

      <br />

      <input type="file" accept=".json" onChange={handleUpload} disabled={loading || !selectedLenderId} />
      <button onClick={handleImport} disabled={!jsonData || loading || !selectedLenderId} style={{ marginLeft: "10px" }}>
        Import JSON
      </button>
    </div>
  );
};

export default AdminJSONTools;