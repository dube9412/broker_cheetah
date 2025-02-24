import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminLenders = () => {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // or "desc"
  const navigate = useNavigate();

  <AdminNav />


  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }

    const fetchLenders = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
        const data = await response.json();
        if (response.ok) {
          setLenders(data.lenders);
        } else {
          console.error("Failed to fetch lenders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching lenders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLenders();
  }, [isAdmin, isSuperAdmin, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lender?")) return;
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) {
        alert("Lender deleted successfully.");
        setLenders((prevLenders) => prevLenders.filter((lender) => lender._id !== id));
      } else {
        alert(`Failed to delete lender: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting lender:", error);
      alert("An error occurred while deleting the lender.");
    }
  };

   // Filter and sort lenders based on user input
   const filteredLenders = useMemo(() => {
    return lenders
      .filter(lender =>
        lender.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  }, [lenders, searchTerm, sortOrder]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <nav className="admin-nav" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/admin-dashboard")} className="nav-button">Admin Home</button>
        <button onClick={() => navigate("/admin/users")} className="nav-button">Users</button>
        <button onClick={() => navigate("/admin/lender-users")} className="nav-button">Lender Users</button>
        <button onClick={() => navigate("/admin/help-tickets")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/analytics")} className="nav-button">Analytics</button>
        <button onClick={() => navigate("/admin/scrapers")} className="nav-button">Scrapers</button>
        <button onClick={() => navigate("/admin/json-tools")} className="nav-button">JSON Tools</button>
        <button onClick={() => navigate("/admin/import-data")} className="nav-button">Import Data</button>
        </nav>
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin lender dashboard. Here you can edit, remove, or manage loan programs for any lender.</p>

      <div style={{ marginBottom: "20px" }}>
        <h2>Actions</h2>
        <button onClick={() => navigate("/add-lender")} style={{ marginRight: "10px" }}>Add Lender</button>
      </div>
      {/* Search Field */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', width: '200px', marginBottom: '20px' }}
      />

      {/* Sort Dropdown */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        style={{ padding: '8px', marginLeft: '10px' }}
      >
        <option value="asc">Name: A-Z</option>
        <option value="desc">Name: Z-A</option>
      </select>

      <h3>Lenders</h3>
      <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Website</th>
            <th>Portal</th>
            <th>Contact</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(lenders) && lenders.length > 0 ? (
            lenders.map((lender) => (
              <tr key={lender._id}>
                <td>{lender.name}</td>
                <td>{lender.website ? <a href={lender.website} target="_blank" rel="noopener noreferrer">{lender.website}</a> : "N/A"}</td>
                <td>{lender.portalAddress ? <a href={lender.portalAddress} target="_blank" rel="noopener noreferrer">{lender.portalAddress}</a> : "N/A"}</td>
                <td>{lender.contactName || "N/A"}</td>
                <td>{lender.phone || "N/A"}</td>
                <td>{lender.email ? <a href={`mailto:${lender.email}`}>{lender.email}</a> : "N/A"}</td>
                <td>
                  <Link to={`/edit-lender/${lender._id}`}><button>Edit</button></Link> {" | "}
                  <button onClick={() => handleDelete(lender._id)}>Delete</button> {" | "}
                  <button onClick={() => navigate(`/manage-loan-programs/${lender._id}`)}>Manage Loan Programs</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No lenders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AdminLenders;