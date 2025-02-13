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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`);
        const lenderData = await response.json();
        setLender(lenderData);
      } catch (error) {
        console.error("Error fetching lender details:", error);
      }

      const programEndpoints = [
        { stateSetter: setFixAndFlipPrograms, url: `https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs` },
        { stateSetter: setDscrPrograms, url: `/api/dscr/${lenderId}/dscr-programs` },
        { stateSetter: setStabilizedBridgePrograms, url: `https://broker-cheetah-backend.onrender.com/api/stabilized-bridge/${lenderId}/stabilized-bridge-programs` },
        { stateSetter: setPortfolioPrograms, url: `https://broker-cheetah-backend.onrender.com/api/portfolio/${lenderId}/portfolio-programs` },
        { stateSetter: setGroundUpPrograms, url: `https://broker-cheetah-backend.onrender.com/api/ground-up/${lenderId}/ground-up-programs` },
      ];

      for (const { stateSetter, url } of programEndpoints) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          stateSetter(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error(`Error fetching programs from ${url}:`, error);
        }
      }
    };

    fetchData();
  }, [lenderId]);

  const handleDeleteLoanProgram = async (programId, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} loan program?`)) return;

    try {
      const loanTypeMapping = {
        "Fix and Flip": "fix-and-flip-programs",
        "DSCR": "dscr-programs",
        "Ground Up": "ground-up-programs",
        "Portfolio": "portfolio-programs",
        "Stabilized Bridge": "stabilized-bridge-programs"
      };

      const loanType = loanTypeMapping[type];
      if (!loanType) throw new Error(`Unknown loan program type: ${type}`);

      const response = await fetch(`/api/${loanType}/${programId}`, { method: "DELETE" });

      if (response.ok) {
        alert(`${type} loan program deleted successfully.`);
        window.location.reload(); // Refresh to show updated programs
      } else {
        const errorData = await response.json();
        console.error("❌ Error deleting loan program:", errorData);
        alert(`Failed to delete ${type} loan program: ${errorData.message || "Unknown error"}`);
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
        <Link to={`https://broker-cheetah-backend.onrender.com/add-fix-and-flip-program/${lenderId}`}><button>Add Fix and Flip Program</button></Link>
        {" | "}
        <Link to={`https://broker-cheetah-backend.onrender.com/add-dscr-program/${lenderId}`}><button>Add DSCR Loan Program</button></Link>
        {" | "}
        <Link to={`https://broker-cheetah-backend.onrender.com/add-ground-up-program/${lenderId}`}><button>Add Ground Up Loan Program</button></Link>
        {" | "}
        <Link to={`https://broker-cheetah-backend.onrender.com/add-portfolio-program/${lenderId}`}><button>Add Portfolio Loan</button></Link>
        {" | "}
        <Link to={`https://broker-cheetah-backend.onrender.com/add-stabilized-bridge-program/${lenderId}`}><button>Add Stabilized Bridge Loan Program</button></Link>
      </div>

      <h3>Mutli-Family Programs</h3>
          <button>MF Fix and Flip</button>{" | "}
            <button>MF DSCR</button>{" | "}
            <button>MF Ground Up</button>{" | "}
            <button>MF Stabilized Bridge</button>{" | "}
            <button>MF Portfolio</button>{" | "}
            <br />
            <h3>Commercial Programs</h3>
            <button>Mixed Use</button>{" | "}
            <button>General Commercial</button>{" | "}

            <h2>EXISTING LOAN PROGRAMS</h2>
<ul>
  {[...fixAndFlipPrograms, ...dscrPrograms, ...groundUpPrograms, ...portfolioPrograms, ...stabilizedBridgePrograms].map((program) => (
    <li key={program._id}>
      <strong>{program.name}</strong>
      <Link to={`https://broker-cheetah-backend.onrender.com/edit-${program.type.toLowerCase().replace(/ /g, "-")}-program/${lenderId}/${program._id}`}>
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
