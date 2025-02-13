import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddStabilizedBridge() {
  const { lenderId } = useParams();
  const navigate = useNavigate();
  const [lender, setLender] = useState(null);
  const [numTiers, setNumTiers] = useState(1);
  const [tiers, setTiers] = useState([{ minFICO: "", maxLTV: "", minDSCR: "" }]);
  const [program, setProgram] = useState({
    name: "Stabilized Bridge Loan",
    minLoanAmount: "",
    maxLoanAmount: "",
    minDSCR: "",
    loanTerm: "",
    interestRateRange: "",
    stateAvailability: "",
    propertyTypesAllowed: "",
    prepaymentPenalty: "",
  });

  useEffect(() => {
    const fetchLender = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`);
        const data = await response.json();
        setLender(data);
      } catch (error) {
        console.error("Error fetching lender details:", error);
      }
    };
    fetchLender();
  }, [lenderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumTiersChange = (e) => {
    const newNumTiers = parseInt(e.target.value) || 1;
    setNumTiers(newNumTiers);
    setTiers((prevTiers) => {
      const newTiers = [...prevTiers];
      if (newNumTiers > prevTiers.length) {
        for (let i = prevTiers.length; i < newNumTiers; i++) {
          newTiers.push({ minFICO: "", maxLTV: "", minDSCR: "" });
        }
      } else {
        newTiers.length = newNumTiers;
      }
      return newTiers;
    });
  };

  const handleTierChange = (index, field, value) => {
    setTiers((prevTiers) => {
      const updatedTiers = [...prevTiers];
      updatedTiers[index][field] = value;
      return updatedTiers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedProgram = {
      ...program,
      stateAvailability: program.stateAvailability ? program.stateAvailability.split(",").map((state) => state.trim()) : [],
      propertyTypesAllowed: program.propertyTypesAllowed ? program.propertyTypesAllowed.split(",").map((type) => type.trim()) : [],
      tiers,
    };

    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/stabilized-bridge/${lenderId}/stabilized-bridge-programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedProgram),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Stabilized Bridge program added successfully!");
        navigate(`/manage-loan-programs/${lenderId}`);
      } else {
        alert(`Failed to add program: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding Stabilized Bridge program:", error);
      alert("An error occurred while adding the program.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>
        {lender ? `Adding Stabilized Bridge Loan Program for ${lender.name}` : "Loading Lender..."}
      </h2>

      <form onSubmit={handleSubmit}>
        <label>Minimum Loan Amount:</label>
        <input type="number" name="minLoanAmount" value={program.minLoanAmount} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

        <label>Maximum Loan Amount:</label>
        <input type="number" name="maxLoanAmount" value={program.maxLoanAmount} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

        <label>Minimum DSCR:</label>
        <input type="number" name="minDSCR" value={program.minDSCR} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

        <label>Loan Term (Months):</label>
        <input type="number" name="loanTerm" value={program.loanTerm} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

        <label>Interest Rate Range:</label>
        <input type="text" name="interestRateRange" value={program.interestRateRange} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

        <label>State Availability (comma-separated):</label>
        <input type="text" name="stateAvailability" value={program.stateAvailability} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

        <label>Property Types Allowed (comma-separated):</label>
        <input type="text" name="propertyTypesAllowed" value={program.propertyTypesAllowed} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

        <label>Prepayment Penalty:</label>
        <input type="text" name="prepaymentPenalty" value={program.prepaymentPenalty} onChange={handleChange} style={{ width: "100%", marginBottom: "20px" }} />

        <label>Number of Tiers:</label>
        <select value={numTiers} onChange={handleNumTiersChange} style={{ width: "100%", marginBottom: "10px" }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

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

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button type="submit" style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>
            Save Program
          </button>
          <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} type="button" style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStabilizedBridge;
