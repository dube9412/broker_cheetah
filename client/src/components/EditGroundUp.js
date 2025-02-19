import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditGroundUp() {
  const { lenderId, programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/ground-up/ground-up-programs/${programId}`);
        const data = await response.json();
        if (response.ok) setProgram(data);
        else alert("Failed to load the program.");
      } catch (error) {
        console.error("Error fetching program:", error);
      }
    };
    fetchProgram();
  }, [programId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/ground-up/ground-up-programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(program),
      });
      if (response.ok) {
        alert("Program updated successfully!");
        navigate(`/manage-loan-programs/${lenderId}`);
      } else {
        alert("Failed to update program.");
      }
    } catch (error) {
      console.error("Error updating program:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this loan program?")) return;

    try {
        console.log(`🔹 Deleting loan program: ${programId}`);

        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/ground-up/${lenderId}/ground-up-programs/${programId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log("✅ Loan program deleted.");
            alert("Loan program deleted successfully.");
            navigate(`/manage-loan-programs/${lenderId}`);
        } else {
            const errorData = await response.json().catch(() => ({}));  
            console.error("❌ Error deleting loan program:", errorData.message || response.status);
            alert(`Failed to delete loan program: ${errorData.message || "Unknown error"}`);
        }
    } catch (error) {
        console.error("❌ Error deleting loan program:", error);
        alert("An error occurred while deleting the loan program.");
    }
};

  if (!program) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Edit Ground Up Construction Loan Program</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Minimum Loan Amount:</label>
        <input type="number" name="minLoanAmount" value={program.minLoanAmount} onChange={handleChange} />

        <label>Maximum Loan Amount:</label>
        <input type="number" name="maxLoanAmount" value={program.maxLoanAmount} onChange={handleChange} />

        <label>Total LTC (%):</label>
        <input type="number" name="totalLTC" value={program.totalLTC} onChange={handleChange} />

        <label>Term (Months):</label>
        <input type="number" name="termMonths" value={program.termMonths} onChange={handleChange} />

        <button onClick={handleSave} style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>Save Changes</button>
        <button onClick={handleDelete} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>   Delete Loan Program </button>{" | "}
        <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
            
      </form>
    </div>
  );
}

export default EditGroundUp;
