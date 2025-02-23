import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminImportData = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  <AdminNav />

   useEffect(() => {
      if (!isAdmin && !isSuperAdmin) {
        navigate("/dashboard");
        return;
      }
    }, [isAdmin, isSuperAdmin, navigate]);


  useEffect(() => {
    fetch("https://broker-cheetah-backend.onrender.com/api/admin/import-data")
      .then((res) => res.json())
      .then((data) => setData(data || []))
      .catch((error) => console.error("Error fetching import data:", error));
  }, []);

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/import-data", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    alert(result.message);
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
        <button onClick={() => navigate("/admin/scraper-tools")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/json-import")} className="nav-button">JSON Import</button>
        </nav>
    <div style={{ padding: "20px" }}>
      <h1>Import Data</h1>
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data found.</p>
      )}
    </div>
    </div>
  );
};

export default AdminImportData;

