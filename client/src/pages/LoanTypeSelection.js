import React from "react";
import { useNavigate } from "react-router-dom";

function LoanTypeSelection() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    // e.g., /search/fixandflip or /search/dscr
    navigate(`/search/${type}`);
  };

  return (
    <div>
      <h2>Select a Loan Type</h2>
      <button onClick={() => handleSelect("fixandflip")}>Fix and Flip</button>
      <button onClick={() => handleSelect("dscr")}>DSCR</button>
      <button onClick={() => handleSelect("groundup")}>Ground Up</button>
      <button onClick={() => handleSelect("stabilizedbridge")}>Stabilized Bridge</button>
    </div>
  );
}

export default LoanTypeSelection;
