import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://broker-cheetah-backend.onrender.com/api/lenders")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched lenders:", data);
        if (data.success && Array.isArray(data.lenders)) {
          setLenders(data.lenders); // ✅ Correctly extracting array
        } else {
          console.error("Unexpected Response Format:", data);
        }
      })
      .catch((err) => console.error("Error fetching lenders:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    console.log("Attempting to delete lender ID:", id);

    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        console.log(`Successfully deleted lender ID: ${id}`);

        // Update state immediately to remove the lender from the UI
        setLenders((prevLenders) => prevLenders.filter((lender) => lender._id !== id));

        alert("Lender deleted successfully!");
      } else {
        alert("Error deleting lender.");
      }
    } catch (err) {
      console.error("Error deleting lender:", err);
      alert("Error deleting lender.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ margin: "1rem" }}>
      <h2>Your Dashboard</h2>
      <p>Select an option below:</p>
      <ul style={{ marginBottom: "2rem" }}>
        <li>
          <Link to="/select-loan-type">Lender Search</Link>
        </li>
        <button
  onClick={async () => {
    if (window.confirm("Are you sure you want to run the data scraper? This may take a few minutes.")) {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/scraper/run", {
          method: "POST",
        });

        if (response.ok) {
          alert("✅ Scraper is running. Check your console for updates.");
        } else {
          const errorData = await response.json();
          alert(`❌ Error: ${errorData.message || "Something went wrong."}`);
        }
      } catch (error) {
        console.error("❌ Error running the scraper:", error);
        alert("An error occurred while starting the scraper.");
      }
    }
  }}
>
  Run Scraper
</button>


        <li>History (coming soon)</li>
        <li>Docs (coming soon)</li>
        <li>Pipeline (coming soon)</li>
        <li>Help (coming soon)</li>
        <li>Knowledge Base (coming soon)</li>
      </ul>

      {/* Show Lender Table ONLY for Admins */}
      {isAdmin && (
        <>
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
                    <td>
                      {lender.website ? (
                        <a href={lender.website} target="_blank" rel="noopener noreferrer">
                          {lender.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {lender.portalAddress ? (
                        <a href={lender.portalAddress} target="_blank" rel="noopener noreferrer">
                          {lender.portalAddress}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{lender.contactName || "N/A"}</td>
                    <td>{lender.phone || "N/A"}</td>
                    <td>
                      {lender.email ? (
                        <a href={`mailto:${lender.email}`}>{lender.email}</a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
<Link to={`/edit-lender/${lender._id}`}>
    <button>Edit</button>
</Link> {" | "}
                      <button onClick={() => handleDelete(lender._id)}>Delete</button> {" | "}
                      <button onClick={() => navigate(`https://broker-cheetah-backend.onrender.com/manage-loan-programs/${lender._id}`)}>Manage Loan Programs</button>
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
        </>
      )}
    </div>
  );
}

export default Dashboard;