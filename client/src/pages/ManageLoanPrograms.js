import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ManageLoanPrograms() {
    const { lenderId } = useParams();
    console.log("🔹 Lender ID from URL:", lenderId); // Debugging
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [fixAndFlipPrograms, setFixAndFlipPrograms] = useState([]);
    const [dscrPrograms, setDscrPrograms] = useState([]); // ✅ NEW STATE for DSCR

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

        // Fetch Fix and Flip Loan Programs
        const fetchFixAndFlipPrograms = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/loan-programs/${lenderId}/fix-and-flip-programs`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    console.log("Fetched Fix and Flip Programs:", data);
                    setFixAndFlipPrograms(data);
                } else {
                    console.warn("Invalid Fix and Flip data format:", data);
                    setFixAndFlipPrograms([]);
                }
            } catch (error) {
                console.error("Error fetching Fix and Flip programs:", error);
            }
        };

        // ✅ Fetch DSCR Loan Programs
        const fetchDscrPrograms = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/loan-programs/${lenderId}/dscr-programs`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    console.log("Fetched DSCR Programs:", data);
                    setDscrPrograms(data);
                } else {
                    console.warn("Invalid DSCR data format:", data);
                    setDscrPrograms([]);
                }
            } catch (error) {
                console.error("Error fetching DSCR programs:", error);
            }
        };

        fetchLender();
        fetchFixAndFlipPrograms();
        fetchDscrPrograms(); // ✅ Fetch DSCR Programs
    }, [lenderId]);

    const handleDeleteLoanProgram = async (programId, type) => {
        try {
            console.log(`🔹 Deleting ${type} loan program ${programId}`);
    
            // ✅ Choose the correct API endpoint based on loan type
            let apiEndpoint = `http://localhost:5000/api/loan-programs/${programId}`;
            if (type === "DSCR") {
                apiEndpoint = `http://localhost:5000/api/loan-programs/dscr-programs/${programId}`; // ✅ Fix API Path
            }
    
            const response = await fetch(apiEndpoint, {
                method: "DELETE",
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log(`✅ ${type} Loan program deleted:`, result);
                if (type === "Fix and Flip") {
                    setFixAndFlipPrograms(prevPrograms => prevPrograms.filter(program => program._id !== programId));
                } else if (type === "DSCR") {
                    setDscrPrograms(prevPrograms => prevPrograms.filter(program => program._id !== programId));
                }
            } else {
                console.error(`❌ Error deleting ${type} loan program:`, result);
                alert(`Failed to delete ${type} loan program.`);
            }
        } catch (error) {
            console.error(`❌ Error deleting ${type} loan program:`, error);
            alert(`An error occurred while deleting the ${type} loan program.`);
        }
    };
    

    return (
        <div>
            <h1>Manage Loan Programs for {lender?.name || "Loading..."}</h1>

            {/* Fix and Flip Programs */}
            <h2>Fix and Flip Loan Programs</h2>
            <Link to={`/add-fix-and-flip/${lenderId}`}>
                <button>Add Fix and Flip Program</button>
            </Link>
            {fixAndFlipPrograms.length > 0 ? (
                <ul>
                    {fixAndFlipPrograms.map(program => (
                        <li key={program._id}>
                            {program.name}
                            <Link to={`/edit-fix-and-flip/${lenderId}/${program._id}`}>
                                <button>Edit</button>
                            </Link>
                            <button onClick={() => handleDeleteLoanProgram(program._id, "Fix and Flip")}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No existing Fix and Flip loan programs found.</p>
            )}

            {/* ✅ DSCR Loan Programs */}
            <h2>DSCR Loan Programs</h2>
            <Link to={`/add-dscr-loan/${lenderId}`}>
                <button>Add DSCR Loan Program</button>
            </Link>
            {dscrPrograms.length > 0 ? (
                <ul>
                    {dscrPrograms.map(program => (
                        <li key={program._id}>
                            {program.name}
                            <Link to={`/edit-dscr-loan/${lenderId}/${program._id}`}>
                                <button>Edit</button>
                            </Link>
                            <button onClick={() => handleDeleteLoanProgram(program._id, "DSCR")}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No existing DSCR loan programs found.</p>
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
