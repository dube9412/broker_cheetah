import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ManageLoanPrograms() {
    const { lenderId } = useParams();
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [fixAndFlipPrograms, setFixAndFlipPrograms] = useState();

    useEffect(() => {
        // Fetch lender details
        const fetchLender = async () => {
            try {
                const response = await fetch(`/api/lenders/${lenderId}`);
                const data = await response.json();
                setLender(data);
            } catch (error) {
                console.error("Error fetching lender:", error);
            }
        };

        // Fetch existing "Fix and Flip" loan programs for the lender
        const fetchFixAndFlipPrograms = async () => {
            try {
                const response = await fetch(`/api/lenders/${lenderId}/fix-and-flip-programs`);
                const data = await response.json();
                setFixAndFlipPrograms(data);
            } catch (error) {
                console.error("Error fetching Fix and Flip programs:", error);
            }
        };

        fetchLender();
        fetchFixAndFlipPrograms();
    }, [lenderId]);

    const handleDeleteLoanProgram = async (programId) => {
        try {
            const response = await fetch(`/api/loan-programs/${programId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Update the loanPrograms state after deleting
                setFixAndFlipPrograms(prevPrograms => prevPrograms.filter(program => program._id!== programId));
            } else {
                console.error("Error deleting loan program:", response.status, response.statusText);
                alert("Error deleting loan program. Please check the console for details.");
            }
        } catch (error) {
            console.error("Error deleting loan program:", error);
            alert("Error deleting loan program. Please check the console for details.");
        }
    };

    return (
        <div>
            <h1>Manage Loan Programs for {lender? lender.name: 'Lender'}</h1>

            {/* Add Fix and Flip Program Button */}
            <Link to={`/add-fix-and-flip/${lenderId}`}>
                <button>Add Fix and Flip Program</button>
            </Link>

            {/* Existing Fix and Flip Loan Programs */}
            <h2>Existing Fix and Flip Loan Programs</h2>
            {fixAndFlipPrograms.length > 0? (
                <ul>
                    {fixAndFlipPrograms.map(program => (
                        <li key={program._id}>
                            {/* Display program details */}
                            {program.name}
                            <Link to={`/edit-fix-and-flip/${lenderId}/${program._id}`}>
                                <button>Edit</button>
                            </Link>
                            <button onClick={() => handleDeleteLoanProgram(program._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ): (
                <p>No existing Fix and Flip loan programs found.</p>
            )}

            {/* Back to Dashboard Button */}
            <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px" }}>
                Back to Dashboard
            </button>
        </div>
    );
}

export default ManageLoanPrograms;