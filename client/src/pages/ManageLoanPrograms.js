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
            .then((data) => setLoanPrograms(data.loanPrograms))
            .catch((err) => console.error("Error fetching loan programs:", err));
    }, [lenderId]);

    const handleEdit = (program) => {
        setEditingProgram(program);
        setTierData(program.tiers || []); // Handle undefined tiers
    };

    const handleSave = (updatedProgram) => {
        fetch(`/api/lenders/${lenderId}/loanPrograms/${updatedProgram._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProgram),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoanPrograms(loanPrograms.map(program => program._id === data.loanProgram._id ? data.loanProgram : program));
                setEditingProgram(null);
            })
            .catch(error => console.error("Error saving loan program:", error));
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