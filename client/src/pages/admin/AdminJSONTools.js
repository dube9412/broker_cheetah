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

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchLenders();
  }, [isAdmin, isSuperAdmin, navigate]);

  const fetchLenders = async () => {
    try {
      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
      const data = await response.json();
      if (response.ok && data.lenders) {
        setLenders(data.lenders);
      }
    } catch (error) {
      console.error("❌ Error fetching lenders:", error);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);
        setJsonData(jsonContent);
        alert("✅ JSON file loaded.");
      } catch (error) {
        alert("❌ Error parsing JSON.");
      } finally {
        setLoading(false);
      }
    };
  };

  const handleImport = async () => {
    if (!jsonData || !selectedLenderId) {
      alert("Please upload a file and select a lender.");
      return;
    }

    try {
      const enrichedData = jsonData.map((program) => ({
        ...program,
        lender: selectedLenderId,
      }));

      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/import-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichedData),
      });

      if (response.ok) {
        alert("✅ Loan programs imported successfully.");
        setJsonData(null);
        setSelectedLenderId("");
      } else {
        alert("❌ Import failed.");
      }
    } catch (error) {
      console.error("❌ Import error:", error);
      alert("❌ An error occurred during import.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      

      <h1>📦 Admin JSON Tools</h1>
      <p>Upload Fix and Flip loan programs using a JSON file.</p>

      <input type="file" accept=".json" onChange={handleUpload} disabled={loading} />
      <br /><br />

      <label><strong>Select Lender:</strong></label><br />
      <select
        value={selectedLenderId}
        onChange={(e) => setSelectedLenderId(e.target.value)}
        style={{ width: "300px", padding: "8px", marginTop: "8px" }}
      >
        <option value="">-- Select a lender --</option>
        {lenders
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((lender) => (
            <option key={lender._id} value={lender._id}>
              {lender.name}
            </option>
          ))}
      </select>

      <br /><br />
      <button onClick={handleImport} disabled={!jsonData || !selectedLenderId || loading}>
        Import JSON
      </button>
    </div>
  );
};

export default AdminJSONTools;
