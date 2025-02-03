import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FixAndFlipLoanForm from "../components/LoanProgramForms/FixAndFlipLoanForm";
import DSCRLoanForm from "../components/LoanProgramForms/DSCRLoanForm";
import GroundUpLoanForm from "../components/LoanProgramForms/GroundUpLoanForm";
import StabilizedBridgeLoanForm from "../components/LoanProgramForms/StabilizedBridgeLoanForm";

function ManageLoanPrograms() {
    const { lenderId } = useParams();
    const [loanPrograms, setLoanPrograms] = useState([]);
    const [editingProgram, setEditingProgram] = useState(null);
    const [tierData, setTierData] = useState([]);

    useEffect(() => {
        fetch(`/api/lenders/${lenderId}/loanPrograms`)
            .then((res) => res.json())
            .then((data) => {
                setLoanPrograms(data.loanPrograms || []);
                console.log("Loan Programs:", data.loanPrograms);
            })
            .catch((err) => console.error("Error:", err));
    }, [lenderId]);

    const handleEdit = (program) => {
        fetch(`/api/lenders/${lenderId}/loanPrograms/${program._id}`)
        .then(res => res.json())
        .then(data => {
            setEditingProgram(data.loanProgram);
            setTierData(data.loanProgram.tiers || []); // Important: Handle undefined tiers
        })
        .catch(err => console.error("Error fetching program for edit:", err));
    };

    const handleSave = (updatedProgram) => {
        const method = updatedProgram._id ? "PUT" : "POST";
        const url = updatedProgram._id ? `/api/lenders/${lenderId}/loanPrograms/${updatedProgram._id}` : `/api/lenders/${lenderId}/loanPrograms`;
         // Conditionally include _id in the request body
         const programData = updatedProgram._id? {...updatedProgram }: {...updatedProgram, _id: undefined }; // Remove _id if it doesn't exist

  fetch(url, {
      method,
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(programData), // Send the correct data
  })
    .then((res) => res.json())
    .then((data) => {
          if (method === "PUT") {
              setLoanPrograms(loanPrograms.map((program) => (program._id === data.loanProgram._id? data.loanProgram: program)));
          } else {
              setLoanPrograms([...loanPrograms, data.loanProgram]);
          }
          setEditingProgram(null);
      })
    .catch((error) => console.error("Error saving loan program:", error));
};

    const handleAddProgram = () => {
        const newProgram = {
            name: "",
            type: "",
            lender: lenderId,
            tiers: [],
        };
        setEditingProgram(newProgram);
        setTierData([]);
    };

    const renderLoanForm = () => {
        if (!editingProgram) {
            return null;
        }

        switch (editingProgram.type) {
            case "Fix and Flip":
                return <FixAndFlipLoanForm program={editingProgram} tierData={tierData} setTierData={setTierData} onSave={handleSave} />;
            case "DSCR":
                return <DSCRLoanForm program={editingProgram} tierData={tierData} setTierData={setTierData} onSave={handleSave} />;
            case "Ground Up":
                return <GroundUpLoanForm program={editingProgram} tierData={tierData} setTierData={setTierData} onSave={handleSave} />;
            case "Stabilized Bridge":
                return <StabilizedBridgeLoanForm program={editingProgram} tierData={tierData} setTierData={setTierData} onSave={handleSave} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h2>Manage Loan Programs</h2>

            <button onClick={handleAddProgram}>Add Loan Program</button>
            <h3>Existing Loan Programs</h3>

            <ul>
                {loanPrograms && loanPrograms.length > 0 ? (
                    loanPrograms.map((program) => (
                        <li key={program._id}>
                            {program.name} ({program.type})
                            <button onClick={() => handleEdit(program)}>Edit</button>
                        </li>
                    ))
                ) : (
                    <p>No loan programs found.</p>
                )}
            </ul>

            {renderLoanForm()}
        </div>
    );
}

export default ManageLoanPrograms;