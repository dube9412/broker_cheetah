import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
  const [loanPrograms, setLoanPrograms] = useState();
  const [selectedProgram, setSelectedProgram] = useState("");

  useEffect(() => {
    fetch(`/api/lenders/${lenderId}/loan-programs`)
    .then((res) => res.json())
    .then((data) => {
        if (data.loanPrograms) {
          setLoanPrograms(data.loanPrograms);
        }
      })
    .catch((err) => console.error("Error fetching loan programs:", err));
  }, [lenderId]);

  return (
    <div>
      <h2>Manage Loan Programs</h2>

      {/* Dropdown for selecting loan program type */}
      <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
        <option value="">-- Select Program --</option>
        {LOAN_PROGRAMS.map((program) => (
          <option key={program} value={program}>
            {program}
          </option>
        ))}
      </select>

      <Link to={`/lenders/${lenderId}/loanPrograms/new?type=${selectedProgram}`}>Add Loan Program</Link>
      <h3>Existing Loan Programs</h3>

      <ul>
        {loanPrograms.map((program) => (
          <li key={program._id}>
            {program.name} ({program.type})
            <Link to={`/lenders/${lenderId}/loanPrograms/${program._id}/edit`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageLoanPrograms;