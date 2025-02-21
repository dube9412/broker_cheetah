import React, { useState } from "react";
import OneClickQuoteModal from "./OneClickQuoteModal";

function LenderSearchByType({ onResults }) {
  const [loanType, setLoanType] = useState("");
  const [lenders, setLenders] = useState([]);
  const [selectedLenders, setSelectedLenders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    fetch(`/api/lenders/type/${loanType}`)
      .then((res) => res.json())
      .then((data) => {
        setLenders(data);
        onResults(data);
      })
      .catch((error) => {
        console.error("Error searching by type:", error);
      });
  };

  const handleLenderSelect = (lenderId) => {
    setSelectedLenders((prevSelected) =>
      prevSelected.includes(lenderId)
        ? prevSelected.filter((id) => id !== lenderId)
        : [...prevSelected, lenderId]
    );
  };

  const openQuoteModal = () => {
    if (selectedLenders.length === 0) {
      alert("Please select at least one lender.");
      return;
    }
    setIsModalOpen(true);
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

      <h4>Search Results</h4>
      {lenders.length > 0 ? (
        <ul>
          {lenders.map((lender) => (
            <li key={lender._id}>
              <input
                type="checkbox"
                onChange={() => handleLenderSelect(lender._id)}
                checked={selectedLenders.includes(lender._id)}
              />
              {lender.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No lenders found.</p>
      )}

      {selectedLenders.length > 0 && (
        <button onClick={openQuoteModal} className="bg-blue-500 text-white p-2 rounded">
          Request One-Click Quote
        </button>
      )}

      {isModalOpen && (
        <OneClickQuoteModal
          selectedLenders={selectedLenders}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default LenderSearchByType;

