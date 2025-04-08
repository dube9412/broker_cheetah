import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminHelpTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const resolveTicket = async (ticketId) => {
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/help-tickets/${ticketId}/resolve`, {
        method: "POST",
      });

      if (response.ok) {
        const { ticket } = await response.json();
        setTickets((prevTickets) =>
          prevTickets.map((t) => (t._id === ticketId ? ticket : t))
        );
      } else {
        console.error("Failed to resolve ticket");
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
    }
  };

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
          setTickets(Array.isArray(data.tickets) ? data.tickets : []);
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

  if (loading) return <div className="loading">Loading help tickets...</div>;

  return (
    <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Admin Help Tickets</h1>
      <p style={{ textAlign: "center", fontSize: "1.1em" }}>View and manage help tickets submitted by users.</p>

      <div className="help-ticket-table-container" style={{ display: "flex", justifyContent: "center" }}>
        <table border="1" cellPadding="6" className="help-ticket-table" style={{ width: "80%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#007BFF", color: "white" }}>
              <th>User</th>
              <th>Issue</th>
              <th>Desired Outcome</th>
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
                  <td>{ticket.desiredOutcome}</td>
                  <td>{ticket.status}</td>
                  <td>
                    {ticket.status !== "Resolved" && (
                      <button
                        onClick={() => resolveTicket(ticket._id)}
                        style={{ padding: "5px 10px", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "10px", fontSize: "1.2em" }}>No help tickets available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHelpTickets;
