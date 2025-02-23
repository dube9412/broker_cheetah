import React, { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";

const AdminImportData = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  <AdminNav />


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
    <div style={{ padding: "20px" }}>
      <h1>Import Data</h1>
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default AdminImportData;

