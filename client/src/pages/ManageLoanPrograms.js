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
  const [editingProgramId, setEditingProgramId] = useState(null);

  useEffect(() => {
    fetch(`/api/lenders/${lenderId}`)
      .then((res) => res.json())
      .then((data) => setLender(data.lender || data))
      .catch((err) => console.error("Error fetching lender:", err));

    fetch(`/api/lenders/${lenderId}/loan-programs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.loanPrograms) {
          setLoanPrograms(data.loanPrograms);
        }
      })
      .catch((err) => console.error("Error fetching loan programs:", err));
  }, [lenderId]);

  const handleSaveLoanProgram = () => {
    const programData = {
      name: selectedProgram,
      tiers: tierData,
    };

    const url = editingProgramId
      ? `/api/lenders/${lenderId}/loan-programs/${editingProgramId}`
      : `/api/lenders/${lenderId}/loan-programs`;

    const method = editingProgramId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(programData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (editingProgramId) {
            setLoanPrograms(loanPrograms.map((p) => (p._id === editingProgramId ? data.loanProgram : p)));
          } else {
            setLoanPrograms([...loanPrograms, data.loanProgram]);
          }
          alert("Loan program saved successfully!");
          resetForm();
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
    if (!window.confirm("Are you sure you want to delete this loan program?")) return;

    fetch(`/api/lenders/${lenderId}/loan-programs/${programId}`, { method: "DELETE" })
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

  const handleEditLoanProgram = (program) => {
    setEditingProgramId(program._id);
    setSelectedProgram(program.name);
    setNumTiers(program.tiers.length);
    setTierData(
      program.tiers.map((tier) => ({
        ...tier,
        minLoan: tier.minLoan || "",
        maxLoan: tier.maxLoan || "",
        fico: tier.fico || "",
        experience: tier.experience || "",
        maxLTP: tier.maxLTP || "",
        totalLTC: tier.totalLTC || "",
        maxARV: tier.maxARV || "",
      }))
    );
  };

  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...tierData];
    updatedTiers[index][field] = value;
    setTierData(updatedTiers);
  };

  useEffect(() => {
    if (selectedProgram && numTiers > 0) {
      setTierData((prevTiers) => {
        const newTiers = Array.from({ length: numTiers }, (_, i) => prevTiers[i] || {
          tier: i + 1,
          fico: "",
          experience: "",
          maxLTP: "",
          totalLTC: "",
          maxARV: "",
          minLoan: "",
          maxLoan: "",
        });
        return newTiers;
      });
    }
  }, [numTiers, selectedProgram]);

  const resetForm = () => {
    setEditingProgramId(null);
    setSelectedProgram("");
    setTierData([]);
    setNumTiers(1);
  };

  return (
    <div>
      <h1>Manage Loan Programs for {lender ? lender.name : "Loading..."}</h1>

      <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
        <option value="">-- Select Program --</option>
        {LOAN_PROGRAMS.map((program) => (
          <option key={program} value={program}>{program}</option>
        ))}
      </select>

      {selectedProgram && (
        <div>
          <h2>{editingProgramId ? `Edit ${selectedProgram}` : `Configure ${selectedProgram}`}</h2>
          <label>How many tiers?</label>
          <input
            type="number"
            min="1"
            value={numTiers}
            onChange={(e) => setNumTiers(parseInt(e.target.value) || 1)}
          />
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {tierData.map((tier, index) => (
              <div key={index} style={{ border: "1px solid black", padding: "10px", minWidth: "200px" }}>
                <h3>Tier {tier.tier}</h3>
                {Object.keys(tier).map((key) => (
                  key !== "tier" && (
                    <div key={key}>
                      <label>{key.toUpperCase()}: </label>
                      <input
                        type="number"
                        value={tier[key] || ""}
                        onChange={(e) => handleTierChange(index, key, e.target.value)}
                      />
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
          <button onClick={handleSaveLoanProgram}>{editingProgramId ? "Update Loan Program" : "Save Loan Program"}</button>
        </div>
      )}

      <h2>Existing Loan Programs</h2>
      <ul>
        {loanPrograms.map((program) => (
          <li key={program._id}>
            {program.name} (Tiers: {program.tiers.length})
            <button onClick={() => handleEditLoanProgram(program)}>Edit</button>
            <button onClick={() => handleDeleteLoanProgram(program._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}

export default ManageLoanPrograms;
