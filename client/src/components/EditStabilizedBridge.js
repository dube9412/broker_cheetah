import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditStabilizedBridge() {
  const { lenderId, programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loanRange, setLoanRange] = useState({ min: "", max: "" });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loanTerm, setLoanTerm] = useState("");
  const [highlightNote, setHighlightNote] = useState(""); // Add highlightNote state
  const [rehabComplete, setRehabComplete] = useState(false); // Add rehabComplete state
  const [rehabRemaining, setRehabRemaining] = useState(""); // Add rehabRemaining state

  const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/stabilized-bridge/stabilized-bridge-programs/${programId}`);
        const data = await response.json();

        if (response.ok && data) {
          console.log("✅ Stabilized Bridge Loan Program Loaded:", data);
          setProgram(data);
          setTiers(data.tiers || []);
          setLoanRange(data.loanRange || { min: "", max: "" });
          setPropertyTypes(data.propertyTypes || []);
          setLoanTerm(data.loanTerm || "");
          setHighlightNote(data.highlightNote || ""); // Load highlightNote
          setRehabComplete(data.rehabComplete || false); // Load rehabComplete
          setRehabRemaining(data.rehabRemaining || ""); // Load rehabRemaining
        } else {
          console.error("❌ Error fetching loan program:", data);
          setError("Loan program not found.");
        }
      } catch (err) {
        console.error("❌ Error fetching loan program:", err);
        setError("Error loading loan program.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [programId, lenderId]);

  const handleTierChange = (index, field, value) => {
    setTiers((prevTiers) => {
      const updatedTiers = [...prevTiers];
      updatedTiers[index][field] = value;
      return updatedTiers;
    });
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSave = async () => {
    try {
      console.log(`🔹 Saving Stabilized Bridge Loan Program: ${programId}`);
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/stabilized-bridge/stabilized-bridge-programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...program,
          tiers,
          loanRange,
          propertyTypes,
          loanTerm,
          rehabComplete, // Include rehabComplete in payload
          rehabRemaining: rehabComplete ? null : parseInt(rehabRemaining), // Include rehabRemaining if rehab is not complete
          highlightNote, // Include highlightNote in the payload
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("✅ Stabilized Bridge Loan Program Updated:", result);
        alert("Loan program updated successfully!");
        navigate(`/manage-loan-programs/${lenderId}`);
      } else {
        console.error("❌ Error updating loan program:", result);
        alert("Failed to update loan program.");
      }
    } catch (error) {
      console.error("❌ Error updating loan program:", error);
      alert("An error occurred while updating.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this loan program?")) return;

    try {
      console.log(`🔹 Deleting Stabilized Bridge Loan Program: ${programId}`);

      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/stabilized-bridge/${lenderId}/stabilized-bridge-programs/${programId}`, {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!program) return <p>No loan program found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Editing Stabilized Bridge Loan Program for {program.name}</h2>

      {tiers.map((tier, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>Tier {index + 1}</h3>
          <label>Minimum FICO:</label>
          <input type="number" value={tier.minFICO} onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

          <label>Maximum LTV (%):</label>
          <input type="number" value={tier.maxLTV} onChange={(e) => handleTierChange(index, "maxLTV", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

          <label>Minimum DSCR:</label>
          <input type="number" value={tier.minDSCR} onChange={(e) => handleTierChange(index, "minDSCR", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
        </div>
      ))}

      <label>Loan Range:</label>
      <input type="number" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} style={{ width: "45%", marginRight: "10px" }} />
      <input type="number" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} style={{ width: "45%" }} />

      <label>Property Types:</label>
      <div>
        {PROPERTY_TYPES.map((type) => (
          <label key={type}>
            <input type="checkbox" value={type} checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} />
            {type}
          </label>
        ))}
      </div>

      <label>Loan Term (Months):</label>
      <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

      <fieldset style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        <legend>Rehab Status</legend>
        <label>
          Rehab Complete:
          <input
            type="checkbox"
            checked={rehabComplete}
            onChange={(e) => setRehabComplete(e.target.checked)}
          />
        </label>
        {!rehabComplete && (
          <label>
            Rehab Remaining ($):
            <input
              type="number"
              value={rehabRemaining}
              onChange={(e) => setRehabRemaining(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </label>
        )}
      </fieldset>

      <label>Highlight Note:</label>
      <textarea
        value={highlightNote}
        onChange={(e) => setHighlightNote(e.target.value)}
        placeholder="Enter a note explaining why this program is a good fit"
        style={{ width: "100%", height: "100px", marginBottom: "10px" }}
      />

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleSave} style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>Save Changes</button>
        <button onClick={handleDelete} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>Delete Loan Program</button>{" | "}
        <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

export default EditStabilizedBridge;
