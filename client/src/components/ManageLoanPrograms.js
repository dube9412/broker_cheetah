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
      // Initialize tierData with an array of objects, one for each tier
      const initialTierData = Array.from({ length: numTiers }, (_, i) => ({
        tier: i + 1,
        //... other initial tier properties based on the selected program type
      }));
      setTierData(initialTierData);

      const newProgram = { name: selectedProgram, type: selectedProgram, tiers: initialTierData };
      setLoanPrograms([...loanPrograms, newProgram]);
      setSelectedProgram("");
    }
  };

  const handleSaveLoanProgram = () => {
    const programData = {
      name: selectedProgram,
      tiers: tierData, // Use tierData directly
    };

    console.log("Saving Loan Program Data:", programData);

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
          // Update loanPrograms state based on whether it's a new program or an edit
          setLoanPrograms((prevPrograms) => {
            if (method === "PUT") {
              return prevPrograms.map((program) =>
                program._id === data.loanProgram._id ? data.loanProgram : program
              );
            } else {
              return [...prevPrograms, data.loanProgram];
            }
          });
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
    setNumTiers(program.tiers? program.tiers.length: 1); // Use 1 as default if tiers is undefined
    setTierData(program.tiers ||[]); // Use an empty array as default if tiers is undefined
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

  const handleTierChange = (tierIndex, field, value) => {
    setTierData((prevTierData) => {
      const updatedTiers = [...prevTierData];
      updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], [field]: value };
      return updatedTiers;
    });
  };

  return (
    <div>
      <h1>Manage Loan Programs for {lender ? lender.name : "Lender"}</h1>
      <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
        <option value="">-- Select Program --</option>
        {LOAN_PROGRAMS.map((program) => (
          <option key={program} value={program}>
            {program}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={numTiers}
        onChange={(e) => setNumTiers(parseInt(e.target.value, 10) || 1)}
        min="1"
        style={{ marginLeft: "10px" }}
      />
      <button onClick={handleAddLoanProgram} style={{ marginLeft: "10px" }}>
        Add Loan Program
      </button>
      <br />
      <div>
        {selectedProgram && ( // Conditionally render input fields
          <div>
            <h2>{selectedProgram}</h2>
            {/* Input fields for the number of tiers */}
            <div>
              <label htmlFor="numTiers">Number of Tiers:</label>
              <input
                type="number"
                id="numTiers"
                name="numTiers"
                min="1"
                value={numTiers}
                onChange={(e) => setNumTiers(parseInt(e.target.value, 10) || 1)}
              />
            </div>
            {/* Render tierData input fields */}
            {tierData.map((tier, tierIndex) => (
              <div key={tierIndex} style={{ border: "1px solid #ccc", padding: "10px" }}>
                {LOAN_SCHEMAS[selectedProgram]?.map((field) => (
                  <div key={field}>
                    <label htmlFor={field}>{field}:</label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={tier[field] || ""}
                      onChange={(e) => handleTierChange(tierIndex, field, e.target.value)}
                    />
                    <br />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleSaveLoanProgram} style={{ marginTop: "20px" }}>
        {editingProgramId ? "Update Loan Program" : "Save Loan Program"}
      </button>
      <br />

      {/* Existing Loan Programs List */}
      <h2>Existing Loan Programs</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {loanPrograms.length > 0 ? (
          loanPrograms.map((program, programIndex) => (
            <div key={programIndex} style={{ border: "1px solid #ccc", padding: "10px" }}>
              <h3>{program.name}</h3>
              {program.tiers && program.tiers.length > 0 ? (
                program.tiers.map((tier, tierIndex) => (
                  <div key={tierIndex} style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {LOAN_SCHEMAS[program.name].map((field) => (
                      <div key={field}>
                        <label>{field}</label>
                        <input
                          type="text"
                          value={tier[field] || ""}
                          onChange={(e) => handleTierChange(tierIndex, field, e.target.value)}
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
            </div>
          ))
        ) : (
          <p>No loan programs available</p>
        )}
      </div>

      <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px" }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default ManageLoanPrograms;