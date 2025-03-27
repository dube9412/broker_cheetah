import React from "react";
import { useNavigate } from "react-router-dom";

function LoanTypeSelection() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    // e.g., /search/fixandflip or /search/dscr
    navigate(`/Search/${type}`);
  };

  return (
    <div>
      <h2>Select a Loan Search Type</h2>
      <button onClick={() => handleSelect("fixandflip")}>Fix and Flip</button> {" | "}
      <button onClick={() => handleSelect("dscr")}>DSCR</button>{" | "}
      <button onClick={() => handleSelect("groundup")}>Ground Up</button>{" | "}
      <button onClick={() => handleSelect("stabilizedbridge")}>Stabilized Bridge</button>{" | "}
      <button onClick={() => handleSelect("portfolio")}>Portfolio</button>
    </div>
  );
}

export default LoanTypeSelection;
