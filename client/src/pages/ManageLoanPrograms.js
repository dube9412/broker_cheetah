import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ManageLoanPrograms() {
    const { lenderId } = useParams();
console.log("🔹 Lender ID from URL:", lenderId); // Debugging
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [fixAndFlipPrograms, setFixAndFlipPrograms] = useState([]);

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
                const response = await fetch(`http://localhost:5000/api/loan-programs/${lenderId}/fix-and-flip-programs`);

                const data = await response.json();
                if (Array.isArray(data)) {
                    console.log("Fetched Fix and Flip Programs:", data);
                    setFixAndFlipPrograms(data);
                } else {
                    console.warn("Invalid program data format:", data);
                    setFixAndFlipPrograms([]); // Set to empty array instead of undefined
                }
            } catch (error) {
                console.error("Error fetching Fix and Flip programs:", error);
            }
        };

        fetchLender();
        fetchFixAndFlipPrograms();
    }, [lenderId]);

    const handleDeleteLoanProgram = async (programId) => {
        try {
            console.log(`🔹 Deleting loan program ${programId}`);
            const response = await fetch(`http://localhost:5000/api/loan-programs/${programId}`, {
                method: "DELETE",
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log("✅ Loan program deleted:", result);
                setFixAndFlipPrograms(prevPrograms => prevPrograms.filter(program => program._id !== programId));
            } else {
                console.error("❌ Error deleting loan program:", result);
                alert("Failed to delete loan program.");
            }
        } catch (error) {
            console.error("❌ Error deleting loan program:", error);
            alert("An error occurred while deleting.");
        }
    };
    

    return (
        <div>
            <h1>Manage Loan Programs for {lender?.name || "Loading..."}</h1>


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
            <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer", marginTop: "10px" }}>
    ← Back to Lender List
</button>
        </div>
    );
}

export default ManageLoanPrograms;