import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LOAN_PROGRAMS = [
  "Fix and Flip",
  "DSCR",
  "Ground Up",
  "Stabilized Bridge",
  "Portfolio",
  "MF Fix and Flip",
  "MF DSCR",
  "MF Ground Up",
  "MF Stabilized Bridge",
  "MF Portfolio",
  "Mixed Use",
  "General Commercial",
];

function ManageLoanPrograms() {
  const { lenderId } = useParams();
  const navigate = useNavigate();
  const [lender, setLender] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [loanPrograms, setLoanPrograms] = useState([]);
  const [numTiers, setNumTiers] = useState(1);
  const [tierData, setTierData] = useState([]);

  useEffect(() => {
    fetch(`/api/lenders/${lenderId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched lender data:", data);
        setLender(data);
      })
      .catch((err) => console.error("Error fetching lender:", err));

    fetch(`/api/lenders/${lenderId}/loan-programs`)
      .then((res) => res.json())
      .then((data) => setLoanPrograms(data))
      .catch((err) => console.error("Error fetching loan programs:", err));
  }, [lenderId]);

  const handleSaveLoanProgram = () => {
    const programData = {
      name: selectedProgram,
      tiers: tierData,
    };

    fetch(`/api/lenders/${lenderId}/loan-programs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(programData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLoanPrograms([...loanPrograms, data.loanProgram]);
          alert("Loan program saved successfully!");
        } else {
          alert("Error saving loan program.");
        }
      })
      .catch((err) => {
        console.error("Error saving loan program:", err);
        alert("Error saving loan program.");
      });
  };

  const handleDeleteLoanProgram = (programId) => {
    if (!window.confirm("Are you sure you want to delete this loan program?")) {
      return;
    }

    fetch(`/api/lenders/${lenderId}/loan-programs/${programId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLoanPrograms(loanPrograms.filter((program) => program._id !== programId));
          alert("Loan program deleted successfully!");
        } else {
          alert("Error deleting loan program.");
        }
      })
      .catch((err) => {
        console.error("Error deleting loan program:", err);
        alert("Error deleting loan program.");
      });
  };

  useEffect(() => {
    setTierData(Array.from({ length: numTiers }, (_, i) => ({
      tier: i + 1,
      fico: "",
      experience: "",
      maxLTP: "",
      totalLTC: "",
      maxARV: "",
      minLoan: "",
      maxLoan: ""
    })));
  }, [numTiers]);

  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...tierData];
    updatedTiers[index][field] = value;
    setTierData(updatedTiers);
  };

  return (
    <div>
      <h1>Manage Loan Programs for {lender ? lender.name : "Lender"}</h1>
      <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
        <option value="">-- Select Program --</option>
        {LOAN_PROGRAMS.map((program) => (
          <option key={program} value={program}>{program}</option>
        ))}
      </select>
      <br />
      {selectedProgram && (
        <div>
          <h2>Configure {selectedProgram}</h2>
          <label>How many tiers?</label>
          <input
            type="number"
            min="1"
            value={numTiers}
            onChange={(e) => setNumTiers(parseInt(e.target.value) || 1)}
          />
          <br />
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {tierData.map((tier, index) => (
              <div key={index} style={{ border: "1px solid black", padding: "10px", minWidth: "200px" }}>
                <h3>Tier {tier.tier}</h3>
                <label>FICO: </label>
                <input
                  type="number"
                  value={tier.fico}
                  onChange={(e) => handleTierChange(index, "fico", e.target.value)}
                />
                <br />
                <label>Experience: </label>
                <input
                  type="number"
                  value={tier.experience}
                  onChange={(e) => handleTierChange(index, "experience", e.target.value)}
                />
                <br />
                <label>Max LTP (%): </label>
                <input
                  type="number"
                  value={tier.maxLTP}
                  onChange={(e) => handleTierChange(index, "maxLTP", e.target.value)}
                />
                <br />
                <label>Total LTC (%): </label>
                <input
                  type="number"
                  value={tier.totalLTC}
                  onChange={(e) => handleTierChange(index, "totalLTC", e.target.value)}
                />
                <br />
                <label>Max ARV (%): </label>
                <input
                  type="number"
                  value={tier.maxARV}
                  onChange={(e) => handleTierChange(index, "maxARV", e.target.value)}
                />
                <br />
                <label>Min Loan ($): </label>
                <input
                  type="number"
                  value={tier.minLoan}
                  onChange={(e) => handleTierChange(index, "minLoan", e.target.value)}
                />
                <br />
                <label>Max Loan ($): </label>
                <input
                  type="number"
                  value={tier.maxLoan}
                  onChange={(e) => handleTierChange(index, "maxLoan", e.target.value)}
                />
                <br />
              </div>
            ))}
          </div>
          <button onClick={handleSaveLoanProgram}>Save Loan Program</button>
        </div>
      )}
      <br />
      <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px" }}>Back to Dashboard</button>
    </div>
  );
}

export default ManageLoanPrograms;
