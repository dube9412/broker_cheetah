// client/src/components/LenderSearchByType.js
import React, { useState } from "react";

function LenderSearchByType({ onResults }) {
  const [loanType, setLoanType] = useState("");

  const handleSearch = () => {
    fetch(`/api/lenders/type/${loanType}`)
      .then((res) => res.json())
      .then((data) => onResults(data))
      .catch((error) => {
        console.error("Error searching by type:", error);
      });
  };

  return (
    <div>
      <h3>Search by Loan Type</h3>
      <input
        type="text"
        value={loanType}
        onChange={(e) => setLoanType(e.target.value)}
        placeholder="e.g. FixAndFlip, DSCR, GroundUp, StabBridge"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default LenderSearchByType;
