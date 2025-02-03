import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LOAN_SCHEMAS = {
  "Fix and Flip": ["minFICO", "minExperience", "maxLTP", "totalLTC", "maxARV", "minLoanAmount", "maxLoanAmount"],
  "DSCR": ["minFICO", "minExperience", "minDSCRRatio", "maxLTV", "minLoanAmount", "maxLoanAmount"],
  "Ground Up": ["minFICO", "minExperience", "maxLTC", "minLoanAmount", "maxLoanAmount"],
  "Stabilized Bridge": ["minFICO", "minExperience", "maxLTV", "minLoanAmount", "maxLoanAmount"],
};

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
  const [editingProgramId, setEditingProgramId] = useState(null); // Track if editing

  useEffect(() => {
    fetch(`/api/lenders/${lenderId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched lender data:", data);
        setLender(data.lender || data);
      })
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

  const handleAddLoanProgram = () => {
    if (selectedProgram) {
      const newProgram = { name: selectedProgram, tiers: [] };
      setLoanPrograms([...loanPrograms, newProgram]);
      setSelectedProgram("");
    }
  };

  const handleSaveLoanProgram = () => {
    const programData = {
      name: selectedProgram,
      tiers: tierData,
    };

    console.log("Saving Loan Program Data:", programData); // ✅ Debugging

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
          setLoanPrograms([...loanPrograms, data.loanProgram]);
          setSelectedProgram("");
          setTierData([]);
          setEditingProgramId(null);
        } else {
          alert("Error saving loan program.");
        }
      })
      .catch((err) => {
        console.error("Error saving loan program:", err);
        alert("Error saving loan program.");
      });
  };

  const handleEditLoanProgram = (program) => {
    setEditingProgramId(program._id);
    setSelectedProgram(program.name);
    setTierData(program.tiers);
  };

  const handleDeleteLoanProgram = (programId) => {
    fetch(`/api/lenders/${lenderId}/loan-programs/${programId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLoanPrograms(loanPrograms.filter((program) => program._id !== programId));
        } else {
          alert("Error deleting loan program.");
        }
      })
      .catch((err) => {
        console.error("Error deleting loan program:", err);
        alert("Error deleting loan program.");
      });
  };

  const handleTierChange = (programIndex, tierIndex, field, value) => {
    const updatedLoanPrograms = [...loanPrograms];
    updatedLoanPrograms[programIndex].tiers[tierIndex][field] = value;
    setLoanPrograms(updatedLoanPrograms);
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
      <button onClick={handleAddLoanProgram} style={{ marginLeft: "10px" }}>Add Loan Program</button>
      <br />
      <button onClick={handleSaveLoanProgram} style={{ marginTop: "20px" }}>
        {editingProgramId ? "Update Loan Program" : "Save Loan Program"}
      </button>
      <br />

      {/* 🔹 Existing Loan Programs List */}
      <h2>Existing Loan Programs</h2>
      <ul>
        {loanPrograms.length > 0 ? (
          loanPrograms.map((program, programIndex) => (
            <li key={programIndex}>
              <h3>{program.name}</h3>
              {program.tiers && program.tiers.length > 0 ? (
                program.tiers.map((tier, tierIndex) => (
                  <div key={tierIndex}>
                    {LOAN_SCHEMAS[program.name].map((field) => (
                      <div key={field}>
                        <label>{field}</label>
                        <input
                          type="text"
                          value={tier[field] || ""}
                          onChange={(e) => handleTierChange(programIndex, tierIndex, field, e.target.value)}
                        />
                        <br />
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No tiers available</p>
              )}
              <button onClick={() => handleEditLoanProgram(program)}>Edit</button>
              <button onClick={() => handleDeleteLoanProgram(program._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No loan programs available</p>
        )}
      </ul>

      <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px" }}>Back to Dashboard</button>
    </div>
  );
}

export default ManageLoanPrograms;