import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FixAndFlipLoanForm from "./FixAndFlipLoanForm";

const LOAN_PROGRAMS = [
  "Fix and Flip",
  "DSCR",
  "Ground Up",
  "Stabilized Bridge",
  "Portfolio",
  "MF Fix and Flip",
  "MF DSCR",
  "MF Ground Up",
  "MF Stabilized Bridge",
  "MF Portfolio",
  "Mixed Use",
  "General Commercial",
];

function ManageLoanPrograms() {
  const { lenderId } = useParams();
  const navigate = useNavigate();
  const [lender, setLender] = useState(null);
  const [loanPrograms, setLoanPrograms] = useState([]);

  useEffect(() => {
    fetch(`/api/lenders/${lenderId}`)
      .then((res) => res.json())
      .then((data) => setLender(data.lender || data))
      .catch((err) => console.error("Error fetching lender:", err));

    fetch(`/api/lenders/${lenderId}/loan-programs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.loanPrograms) {
          setLoanPrograms(data.loanPrograms);
        }
      })
      .catch((err) => console.error("Error fetching loan programs:", err));
  }, [lenderId]);

  const handleLoanUpdated = () => {
    fetch(`/api/lenders/${lenderId}/loan-programs`)
      .then((res) => res.json())
      .then((data) => setLoanPrograms(data))
      .catch((err) => console.error("Error updating loan programs:", err));
  };

  return (
    <div>
      <h1>Manage Loan Programs for {lender ? lender.name : "Loading..."}</h1>

      <h2>Available Loan Programs</h2>
      <select>
        {LOAN_PROGRAMS.map((program) => (
          <option key={program} value={program}>{program}</option>
        ))}
      </select>

      <FixAndFlipLoanForm lenderId={lenderId} onLoanUpdated={handleLoanUpdated} />

      <h2>Existing Loan Programs</h2>
      <ul>
        {loanPrograms.map((program) => (
          <li key={program._id}>
            {program.name}
            <button onClick={() => navigate(`/edit-loan-program/${program._id}`)}>Edit</button>
            <button onClick={() => handleLoanUpdated()}>Refresh</button>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}

export default ManageLoanPrograms;
