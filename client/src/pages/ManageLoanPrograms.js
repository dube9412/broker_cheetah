import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FixAndFlipLoanForm from "./LoanProgramForms/FixAndFlipLoanForm";
import DSCRLoanForm from "./LoanProgramForms/DSCRLoanForm";
import GroundUpLoanForm from "./LoanProgramForms/GroundUpLoanForm";
import StabilizedBridgeLoanForm from "./LoanProgramForms/StabilizedBridgeLoanForm";

function ManageLoanPrograms() {
    const { lenderId } = useParams();
    const [lender, setLender] = useState(null);
    const [loanPrograms, setLoanPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null); // Store the whole program object
    const [editingProgram, setEditingProgram] = useState(null); // Store the program being edited
    const [tierData, setTierData] = useState([]); // Data for the tiers

    useEffect(() => {
        fetch(`/api/lenders/${lenderId}`)
            .then((res) => res.json())
            .then((data) => setLender(data.lender || data))
            .catch((err) => console.error("Error fetching lender:", err));

        fetch(`/api/lenders/${lenderId}/loanPrograms`)
            .then((res) => res.json())
            .then((data) => {
                setLoanPrograms(data.loanPrograms);
            })
            .catch((err) => console.error("Error fetching loan programs:", err));
    }, [lenderId]);

    const handleEdit = (program) => {
        setEditingProgram(program);
        setTierData(program.tiers); // Initialize tier data with existing tiers
    };

    const handleSave = (updatedProgram) => {
        // Send the updated program data to your API for saving
        fetch(`/api/lenders/${lenderId}/loanPrograms/${updatedProgram._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProgram),
        })
            .then((res) => res.json())
            .then((data) => {
                // Update the loanPrograms state with the saved data.
                setLoanPrograms(loanPrograms.map(program => program._id === data.loanProgram._id ? data.loanProgram : program));
                setEditingProgram(null); // Close the form after saving
            })
            .catch(error => console.error("Error saving loan program:", error));

    };


    const renderLoanForm = () => {
        if (!editingProgram) {
            return null; // Or a message like "Select a program to edit"
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
            <ul>
                {loanPrograms.map((program) => (
                    <li key={program._id}>
                        {program.name} ({program.type})
                        <button onClick={() => handleEdit(program)}>Edit</button>
                    </li>
                ))}
            </ul>

            {renderLoanForm()}
        </div>
    );
}

export default ManageLoanPrograms;