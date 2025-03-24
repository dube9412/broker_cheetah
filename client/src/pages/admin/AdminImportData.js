import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/AdminNav";

const AdminImportData = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();


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

