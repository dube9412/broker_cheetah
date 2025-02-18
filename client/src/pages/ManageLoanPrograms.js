import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ManageLoanPrograms() {
  const { lenderId } = useParams();
  const navigate = useNavigate();

  const [lender, setLender] = useState(null);
  const [fixAndFlipPrograms, setFixAndFlipPrograms] = useState([]);
  const [dscrPrograms, setDscrPrograms] = useState([]);
  const [stabilizedBridgePrograms, setStabilizedBridgePrograms] = useState([]);
  const [portfolioPrograms, setPortfolioPrograms] = useState([]);
  const [groundUpPrograms, setGroundUpPrograms] = useState([]);

  // ✅ Fetch function for loan programs
  const fetchPrograms = async (url, stateSetter) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        stateSetter(Array.isArray(data) ? data : []);
      } else if (response.status === 404) {
        console.warn(`⚠️ No programs found for ${url}`);
        stateSetter([]);
      } else {
        console.error(`❌ Error fetching programs from ${url}:`, response.status);
      }
    } catch (error) {
      console.error(`❌ Error fetching programs from ${url}:`, error);
    }
  };

  useEffect(() => {
    const fetchLender = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`);
        if (response.ok) {
          const data = await response.json();
          setLender(data);
        } else {
          console.error(`❌ Failed to fetch lender: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Error fetching lender:", error);
      }
    };

    const fetchData = async () => {
      const programEndpoints = [
        { stateSetter: setFixAndFlipPrograms, url: `https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs` },
        { stateSetter: setDscrPrograms, url: `https://broker-cheetah-backend.onrender.com/api/dscr/${lenderId}/dscr-programs` },
        { stateSetter: setStabilizedBridgePrograms, url: `https://broker-cheetah-backend.onrender.com/api/stabilized-bridge/${lenderId}/stabilized-bridge-programs` },
        { stateSetter: setPortfolioPrograms, url: `https://broker-cheetah-backend.onrender.com/api/portfolio/${lenderId}/portfolio-programs` },
        { stateSetter: setGroundUpPrograms, url: `https://broker-cheetah-backend.onrender.com/api/ground-up/${lenderId}/ground-up-programs` },
      ];

      for (const { stateSetter, url } of programEndpoints) {
        await fetchPrograms(url, stateSetter);
      }
    };

    fetchLender();
    fetchData();
  }, [lenderId]);

  // ✅ DELETE Function for Loan Programs
  const handleDeleteLoanProgram = async (programId, programType) => {
    try {
        // ✅ Map programType to the correct API endpoint dynamically
        const loanTypeMapping = {
            "Fix and Flip": "fix-and-flip-programs",
            "DSCR": "dscr-programs",
            "Ground Up": "ground-up-programs",
            "Portfolio": "portfolio-programs",
            "Stabilized Bridge": "stabilized-bridge-programs"
        };

        const baseUrl = loanTypeMapping[programType];
        if (!baseUrl) {
            console.error(`❌ Unknown loan program type: ${programType}`);
            alert(`Unknown loan program type: ${programType}`);
            return;
        }

        // ✅ Construct DELETE request URL
        const url = `/api/${baseUrl}/${programId}`;

        // ✅ Send DELETE request
        const response = await fetch(url, { method: "DELETE" });

        if (response.ok) {
            // ✅ Successfully deleted → Remove from state
            alert(`${programType} loan program deleted successfully.`);
            switch (programType) {
                case "Fix and Flip":
                    setFixAndFlipPrograms(prev => prev.filter(program => program._id !== programId));
                    break;
                case "DSCR":
                    setDscrPrograms(prev => prev.filter(program => program._id !== programId));
                    break;
                case "Ground Up":
                    setGroundUpPrograms(prev => prev.filter(program => program._id !== programId));
                    break;
                case "Portfolio":
                    setPortfolioPrograms(prev => prev.filter(program => program._id !== programId));
                    break;
                case "Stabilized Bridge":
                    setStabilizedBridgePrograms(prev => prev.filter(program => program._id !== programId));
                    break;
                default:
                    console.warn(`⚠️ No state update needed for ${programType}`);
            }
        } else {
            // ❌ Handle error response
            const errorData = await response.json().catch(() => ({}));
            console.error("❌ Error deleting loan program:", errorData.message || response.status);
            alert(`Error deleting loan program: ${errorData.message || "Unknown error"}`);
        }
    } catch (error) {
        console.error("❌ Error deleting loan program:", error);
        alert("An error occurred while deleting the loan program.");
    }
};

  return (
    <div>
      <h1>Manage Loan Programs for {lender?.name || "Loading..."}</h1>

      <h2>LOAN PROGRAMS</h2>
      <h3>Residential 1-4</h3>
      <div>
        <Link to={`/add-fix-and-flip-program/${lenderId}`}><button>Add Fix and Flip Program</button></Link>
        {" | "}
        <Link to={`/add-dscr-program/${lenderId}`}><button>Add DSCR Loan Program</button></Link>
        {" | "}
        <Link to={`/add-ground-up-program/${lenderId}`}><button>Add Ground Up Loan Program</button></Link>
        {" | "}
        <Link to={`/add-portfolio-program/${lenderId}`}><button>Add Portfolio Loan</button></Link>
        {" | "}
        <Link to={`/add-stabilized-bridge-program/${lenderId}`}><button>Add Stabilized Bridge Loan Program</button></Link>
      </div>

      <h3>Multi-Family Programs</h3>
      <button>MF Fix and Flip</button>{" | "}
      <button>MF DSCR</button>{" | "}
      <button>MF Ground Up</button>{" | "}
      <button>MF Stabilized Bridge</button>{" | "}
      <button>MF Portfolio</button>{" | "}
      
      <h3>Commercial Programs</h3>
      <button>Mixed Use</button>{" | "}
      <button>General Commercial</button>{" | "}

      <h2>EXISTING LOAN PROGRAMS</h2>
      <ul>
        {[...fixAndFlipPrograms, ...dscrPrograms, ...groundUpPrograms, ...portfolioPrograms, ...stabilizedBridgePrograms].map((program) => (
          <li key={program._id}>
            <strong>{program.name}</strong>
            <Link to={`/edit-${program.type.toLowerCase().replace(/ /g, "-")}-program/${lenderId}/${program._id}`}>
              <button>Edit</button>
            </Link>
            {" | "}
            <button onClick={() => handleDeleteLoanProgram(program._id, program.type)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px" }}>Back to Dashboard</button>
    </div>
  );
}

export default ManageLoanPrograms;
