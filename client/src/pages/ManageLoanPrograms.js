import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LOAN_PROGRAM_CONFIG = {
    "Fix and Flip": {
        name: "Fix and Flip",
        fields: [
            { name: "minFICO", label: "Min FICO", type: "number" },
            { name: "minExperience", label: "Min Experience", type: "number" },
            { name: "maxLTP", label: "Max LTP", type: "number" },
            { name: "totalLTC", label: "Total LTC", type: "number" },
            { name: "maxARV", label: "Max ARV", type: "number" },
            { name: "minLoanAmount", label: "Min Loan Amount", type: "number" },
            { name: "maxLoanAmount", label: "Max Loan Amount", type: "number" },
        ],
    },
    "DSCR": {
        name: "DSCR",
        fields: [
            { name: "minFICO", label: "Min FICO", type: "number" },
            { name: "minDSCR", label: "Min DSCR", type: "number" },
            //... other fields specific to DSCR loans
        ],
    },
    "Ground Up": {
        name: "Ground Up",
        fields: [
            { name: "minFICO", label: "Min FICO", type: "number" },
            { name: "maxLoanAmount", label: "Max Loan Amount", type: "number" },
            //... other fields specific to Ground Up loans
        ],
    },
    //... Add configuration for all 12 loan program types
};

function ManageLoanPrograms() {
    const { lenderId } = useParams();
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedProgramType, setSelectedProgramType] = useState(null); // New state
    const [loanPrograms, setLoanPrograms] = useState([]);
    const [numTiers, setNumTiers] = useState(1);
    const [tierData, setTierData] = useState([]);
    const [editingProgramId, setEditingProgramId] = useState(null);

    useEffect(() => {
        fetch(`/api/lenders/${lenderId}`)
        .then((res) => res.json())
        .then((data) => {
                setLender(data.lender || data);
            })
        .catch((err) => console.error("Error fetching lender:", err));

            const fetchPrograms = async () => {
                try {
                    const response = await fetch(`/api/lenders/${lenderId}/loan-programs?programType=${selectedProgramType}`);
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  const data = await response.json();
                  if (data.loanPrograms) {
                    setLoanPrograms(data.loanPrograms);
                  }
                } catch (err) {
                  console.error("Error fetching loan programs:", err);
                }
              };
        
              if (selectedProgramType) {
                fetchPrograms();
              } else {
                setLoanPrograms(); // Clear programs if type is not selected
              }

    }, [lenderId, selectedProgramType]); // Add selectedProgramType to dependency array



    const handleProgramTypeSelect = (event) => {
        const programType = event.target.value;
        setSelectedProgramType(programType);

        try {
            const programDetails = LOAN_PROGRAM_CONFIG[programType];
            if (programDetails) {
                createInputFields(programDetails);
                const initialTierData = programDetails.fields.map(field => ({
                    [field.name]: ''
                }));
                setTierData(initialTierData);
            } else {
                console.warn("Selected program not found in config.");
                setTierData();
            }
        } catch (error) {
            console.error("Error handling program type selection:", error);
            setTierData();
        }
    };
    /*const handleAddLoanProgram = () => {
        if (selectedProgram) {
            const initialTierData = Array.from({ length: numTiers }, (_, i) => ({
                tier: i + 1,
                //... other initial tier properties based on the selected program type
            }));
            setTierData(initialTierData);

            const newProgram = { name: selectedProgram, type: selectedProgram, tiers: initialTierData };
            setLoanPrograms([...loanPrograms, newProgram]);
            setSelectedProgram("");
        }
    };*/

    const handleSaveLoanProgram = async () => {
        try {
            // Construct the programData object
            const programData = {
                name: selectedProgramType,
                type: selectedProgramType,
                tiers: tierData,
            };
    
            // Determine the HTTP method (POST for new, PUT for editing)
            const method = editingProgramId? 'PUT': 'POST';
            const url = editingProgramId
              ? `/api/lenders/${lenderId}/loan-programs/${editingProgramId}`
              : `/api/lenders/${lenderId}/loan-programs`;
    
            // Send the data to the server
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(programData),
            });
    
            const data = await response.json();
    
            if (data.success) {
                // Update loanPrograms state based on whether it's a new program or an edit
                setLoanPrograms(prevPrograms => {
                    if (method === "PUT") {
                        return prevPrograms.map(program =>
                            program._id === editingProgramId? data.loanProgram: program
                        );
                    } else {
                        return [...prevPrograms, data.loanProgram];
                    }
                });
    
                // Reset the form fields and state
                setSelectedProgramType(null); // Reset selectedProgramType
                setTierData();
                setEditingProgramId(null);
            } else {
                // Handle errors and display a message to the user
                console.error("Error saving loan program:", data.message || "Server error");
                alert("Error saving loan program. Please check the console for details.");
            }
        } catch (error) {
            console.error("Error saving loan program:", error);
            alert("Error saving loan program. Please check the console for details.");
        }
    };

   const handleEditLoanProgram = async (programId) => {
    try {
        // Fetch the existing loan program data from the server
        const response = await fetch(`/api/lenders/${lenderId}/loan-programs/${programId}`);
        const data = await response.json();

         // Populate input fields with the fetched data
         setSelectedProgramType(data.loanProgram.type); // Set the selected program type
         setTierData(data.loanProgram.tiers); // Set the tier data
         //... set other input fields based on data.loanProgram...


        } catch (error) {
            //... error handling...
        }
    };

    const handleDeleteLoanProgram = (programId) => {
        fetch(`/api/lenders/<span class="math-inline">\{lenderId\}/loan\-programs/</span>{programId}`, {
            method: "DELETE",
        })
        .then((res) => res.json())
        .then((data) => {
                if (data.success) {
                    setLoanPrograms(loanPrograms.filter((program) => program._id!== programId));
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
            updatedTiers[tierIndex] = {...updatedTiers[tierIndex], [field]: value };
            return updatedTiers;
        });
    };

    const handleProgramSelect = async (event) => {
        const selectedProgramName = event.target.value;
        setSelectedProgram(selectedProgramName);

        if (selectedProgramName) {
            try {
                const programDetails = LOAN_PROGRAM_CONFIG[selectedProgramName]; // Get from config
                if (programDetails) {
                    createInputFields(programDetails);
                    // Set initial tierData with values from programDetails.fields
                    const initialTierData = programDetails.fields.map(field => ({
                        [field.name]: '' // Set initial value to empty string
                    }));
                    setTierData(initialTierData);
                    setNumTiers(1);
                } else {
                    console.warn("Selected program not found in config.");
                    setTierData();
                    setNumTiers(1);
                }
            } catch (error) {
                console.error("Error fetching program details:", error);
                setTierData();
                setNumTiers(1);
            }
        } else {
            setTierData();
            setNumTiers(1);
        }
    };

    function createInputFields(programDetails) {
      const loanProgramInputs = document.getElementById('loanProgramInputs');
      loanProgramInputs.innerHTML = ''; // Clear previous inputs

      if (programDetails && programDetails.fields) { // Make sure programDetails and fields exist
          programDetails.fields.forEach(field => {
              const label = document.createElement('label');
              label.textContent = field.label;
              loanProgramInputs.appendChild(label);

              const input = document.createElement('input');
              input.type = field.type || 'text';
              input.name = field.name;
              input.id = field.name; // Add ID for label association
              loanProgramInputs.appendChild(input);

              // Add event listener for input change, if needed
              input.addEventListener('change', (e) => {
                handleTierChange(0, field.name, e.target.value); // Assuming only one tier for now
              });

              loanProgramInputs.appendChild(document.createElement('br'));
          });
      }
  }

  return (
      <div>
          <h1>Manage Loan Programs for {lender? lender.name: "Lender"}</h1>

          <select value={selectedProgramType || ""} onChange={handleProgramTypeSelect}>
              <option value="">-- Select Program Type --</option>
              {Object.keys(LOAN_PROGRAM_CONFIG).map((type) => (
                  <option key={type} value={type}>{type}</option>
              ))}
          </select>

          <select value={selectedProgram} onChange={handleProgramSelect}>
              <option value="">-- Select Program --</option>
              {loanPrograms && loanPrograms.map((program) => (
                  <option key={program._id} value={program._id}>
                      {program.name}
                  </option>
              ))}
          </select>
          <br />
          <div>
              {selectedProgram && (
                  <div>
                      <h2>{selectedProgram}</h2>
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
                      <div id="loanProgramInputs"></div> {/* Container for dynamic inputs */}
                      {tierData && tierData.map((tier, tierIndex) => (
                          <div key={tierIndex} style={{ border: "1px solid #ccc", padding: "10px" }}>
                              {/* Tier Data inputs will go here */}
                              {Object.keys(tier).map(key => (
                                  <div key={key}>
                                      <label htmlFor={key}>{key}:</label>
                                      <input
                                          type="text"
                                          id={key}
                                          name={key}
                                          value={tier[key] || ""}
                                          onChange={(e) => handleTierChange(tierIndex, key, e.target.value)}
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
              {editingProgramId? "Update Loan Program": "Save Loan Program"}
          </button>
          <br />

          {/* Existing Loan Programs List */}
          <h2>Existing Loan Programs</h2>
          <div>
              {loanPrograms && loanPrograms.length > 0? (
                  loanPrograms.map((program, programIndex) => (
                      <div key={programIndex} style={{ border: "1px solid #ccc", padding: "10px" }}>
                          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                              <h3>{program.name}</h3>
                              {program.tiers && program.tiers.length > 0? (
                                  program.tiers.map((tier, tierIndex) => (
                                      <div key={tierIndex} style={{ border: "1px solid #ccc", padding: "10px" }}>
                                          {/* Conditionally render fields based on program.name */}
                                          {Object.keys(tier).map(key => (
                                              <div key={key}>
                                                  <label>{key}:</label>
                                                  <input
                                                      type="text"
                                                      value={tier[key] || ""}
                                                      onChange={(e) => handleTierChange(tierIndex, key, e.target.value)}
                                                  />
                                                  <br />
                                              </div>
                                          ))}
                                      </div>
                                  ))
                              ): (
                                  <p>No tiers available</p>
                              )}
                              <button onClick={() => handleEditLoanProgram(program)}>Edit</button>
                              <button onClick={() => handleDeleteLoanProgram(program._id)}>Delete</button>
                          </div>
                      </div>
                  ))
              ): (
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