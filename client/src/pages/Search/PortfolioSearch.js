import React, { useState } from "react";
import Glossary from "../../components/hardMoneyClass/Glossary";
import "../../styles/SearchPages.css";

const BASE_URL = "https://broker-cheetah-backend.onrender.com";

const US_STATES = [
  "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
  "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME",
  "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM",
  "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
  "UT", "VA", "VT", "WA", "WI", "WV", "WY"
];

function SearchPortfolio() {
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        fico,
        experience,
        loanAmount,
        propertyType,
        state,
        zipcode,
      });

      const res = await fetch(`https://broker-cheetah-backend.onrender.com/api/portfolio/search?${params}`);
      const data = await res.json();

      setResults(data);
    } catch (error) {
      console.error("❌ Error searching Portfolio programs:", error);
      alert("Search failed.");
    }
  };

  const handleClear = () => {
    setFico("");
    setExperience("");
    setLoanAmount("");
    setPropertyType("");
    setState("");
    setZipcode("");
    setResults([]);
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Portfolio Loan Search</h1>
      <p className="search-subtitle">Enter one or more filters to find matching loan programs.</p>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Deal Details</legend>
        <label>FICO Score:
          <input value={fico} onChange={(e) => setFico(e.target.value)} />
        </label><br />

        <label>Experience (# of rentals):
          <input value={experience} onChange={(e) => setExperience(e.target.value)} />
        </label><br />

        <label>Loan Amount:
          <input value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
        </label><br />

        <label>Property Type:
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="Single Family 1-4">Single Family 1-4</option>
            <option value="Condo">Condo</option>
            <option value="Townhome">Townhome</option>
            <option value="Manufactured">Manufactured</option>
            <option value="Cabins">Cabins</option>
          </select>
        </label><br />
      </fieldset>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Borrower Profile</legend>
        <label>State:
          <input value={state} onChange={(e) => setState(e.target.value)} />
        </label><br />

        <label>Zipcode:
          <input value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
        </label><br />
      </fieldset>

      <button className="search-button" onClick={handleSearch}>🔍 Search</button>
      <button className="search-button" onClick={handleClear} style={{ marginLeft: "10px" }}>🔄 New Search</button>

      <div className="search-results">
        {results.length === 0 && <p>No matching programs.</p>}
        {results.map((program, i) => (
          <div key={i} className="search-result-item">
            <strong>✅ {program.lenderName}</strong> <br />
            <strong>Loan Range:</strong> ${program.loanRangeMin} - ${program.loanRangeMax} <br />
            <strong>Term:</strong> {program.termMonths} months<br />
            <strong>Max LTV:</strong> {program.maxLTV || "N/A"} <br />
            <strong>Max Portfolio Size:</strong> {program.maxPortfolioSize || "N/A"} <br />
          </div>
        ))}
      </div>

      <Glossary />
    </div>
  );
}

export default SearchPortfolio;
