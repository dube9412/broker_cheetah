import React, { useEffect, useState } from "react";

const AdminImportData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://broker-cheetah-backend.onrender.com/api/admin/import-data")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching import data:", error));
  }, []);

  return (
    <div>
      <h1>Import Data</h1>
      {data.length > 0 ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No import data found.</p>
      )}
    </div>
  );
};

export default AdminImportData;
