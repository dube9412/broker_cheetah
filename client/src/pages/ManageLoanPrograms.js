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
                const response = await fetch(`http://localhost:5000/api/fix-and-flip/${lenderId}/fix-and-flip-programs`);
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
                const response = await fetch(`http://localhost:5000/api/dscr/${lenderId}/dscr-programs`);
                const data = await response.json();

                console.log("Fetched DSCR Programs:", data);
                if (Array.isArray(data)) {
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
        if (!window.confirm("Are you sure you want to delete this loan program?")) return;
      
        try {
          const loanType = type.toLowerCase().replace(/ /g, "-"); // Converts "Fix and Flip" -> "fix-and-flip"
          console.log(`🔹 Deleting loan program of type: ${loanType} with ID: ${programId}`);
      
          const response = await fetch(`http://localhost:5000/api/${loanType}/${loanType}-programs/${programId}`, {
            method: "DELETE",
          });
      
          if (response.ok) {
            console.log("✅ Loan program deleted successfully");
            alert("Loan program deleted successfully.");
      
            // Filter out the deleted program from state
            if (loanType === "fix-and-flip") {
              setFixAndFlipPrograms(prev => prev.filter(program => program._id !== programId));
            } else if (loanType === "dscr") {
              setDscrPrograms(prev => prev.filter(program => program._id !== programId));
            }
          } else {
            const errorData = await response.json();
            console.error("❌ Error deleting loan program:", errorData);
            alert(`Failed to delete loan program: ${errorData.message || "Unknown error"}`);
          }
        } catch (error) {
          console.error("❌ Error deleting loan program:", error);
          alert("An error occurred while deleting the loan program.");
        }
      };
      
      
           
    

      return (
        <div>
          <h1>Manage Loan Programs for {lender?.name || "Loading..."}</h1>
    
          {/* Loan Programs */}
          <h2>Loan Programs</h2>
          <Link to={`/add-fix-and-flip-program/${lenderId}`}>
            <button>Add Fix and Flip Program</button>
          </Link>
          {fixAndFlipPrograms.length > 0 ? (
            <ul>
              {fixAndFlipPrograms.map((program) => (
                <li key={program._id}>
                  <strong>{program.name}</strong>
                  <Link to={`/edit-fix-and-flip-program/${lenderId}/${program._id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDeleteLoanProgram(program._id, "Fix and Flip")}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No existing Fix and Flip loan programs found.</p>
          )}
    
             
          <Link to={`/add-dscr-program/${lenderId}`}>
            <button>Add DSCR Loan Program</button>
          </Link>
          {dscrPrograms.length > 0 ? (
            <ul>
              {dscrPrograms.map((program) => (
                <li key={program._id}>
                  <strong>{program.name}</strong> – {program.type}
                  <Link to={`/edit-dscr-program/${lenderId}/${program._id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDeleteLoanProgram(program._id, "DSCR")}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No existing DSCR loan programs found.</p>
          )}
    
          <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px" }}>
            Back to Dashboard
          </button>
        </div>
      );
    }
    
    export default ManageLoanPrograms;