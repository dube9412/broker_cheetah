import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import HelpTickets from "../../assets/HelpTickets"; // ❌ This might be wrong


const AdminHelpTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/help-tickets");
        const data = await response.json();
        if (response.ok) {
          setTickets(data.tickets);
        } else {
          console.error("Failed to fetch help tickets:", data.message);
        }
      } catch (error) {
        console.error("Error fetching help tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [isAdmin, isSuperAdmin, navigate]);

  const handleResolve = async (id) => {
    if (!window.confirm("Are you sure you want to mark this ticket as resolved?")) return;
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/help-tickets/${id}/resolve`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Help ticket resolved successfully.");
        setTickets((prevTickets) => prevTickets.map((ticket) => (ticket._id === id ? { ...ticket, status: "Resolved" } : ticket)));
      } else {
        alert("Failed to resolve help ticket.");
      }
    } catch (error) {
      console.error("Error resolving help ticket:", error);
      alert("An error occurred while resolving the help ticket.");
    }
  };

  if (loading) return <div>Loading help tickets...</div>;

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
      
      <h1>Admin Help Tickets</h1>
      <p>View and manage user help requests.</p>

      <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.userEmail}</td>
                <td>{ticket.issue}</td>
                <td>{ticket.status}</td>
                <td>
                  {ticket.status !== "Resolved" && (
                    <button onClick={() => handleResolve(ticket._id)}>Resolve</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No help tickets found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHelpTickets;