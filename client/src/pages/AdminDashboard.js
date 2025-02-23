import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate("/admin/users")} className="bg-blue-500 text-white p-3 rounded">Manage Users</button>
        <button onClick={() => navigate("/admin/lenders")} className="bg-green-500 text-white p-3 rounded">Manage Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} className="bg-purple-500 text-white p-3 rounded">Lender User Assignments</button>
        <button onClick={() => navigate("/admin/help-tickets")} className="bg-yellow-500 text-white p-3 rounded">Help Tickets</button>
        <button onClick={() => navigate("/admin/analytics")} className="bg-red-500 text-white p-3 rounded">Analytics & Income</button>
        <button onClick={() => navigate("/admin/scrapers")} className="bg-gray-500 text-white p-3 rounded">Scrapers</button>
        <button onClick={() => navigate("/admin/json-tools")} className="bg-indigo-500 text-white p-3 rounded">JSON Tools</button>
        <button onClick={() => navigate("/admin/import-data")} className="bg-orange-500 text-white p-3 rounded">Import Data</button>
        <button onClick={() => navigate("/dashboard")} className="bg-black text-white p-3 rounded">User Dashboard</button>
      </div>
    </div>
  );
};

export default AdminPanel;


