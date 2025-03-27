import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [maxLTV, setMaxLTV] = useState("");
  const [maxPortfolioSize, setMaxPortfolioSize] = useState("");
  const [minDSCR, setMinDSCR] = useState("");
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
        loanTerm,
        maxLTV,
        maxPortfolioSize,
        minDSCR,
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
    setLoanTerm("");
    setMaxLTV("");
    setMaxPortfolioSize("");
    setMinDSCR("");
    setResults([]);
  };

  return (
    <div className="search-container">
      <button className="back-button" onClick={() => navigate("/lender-search")}>🔙 Back to Loan Types</button>
      <h1 className="search-title">Portfolio Loan Search</h1>
      <p className="search-subtitle">Enter one or more filters to find matching loan programs.</p>

      <div className="search-row">
        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Deal Details</legend>
          <label className="search-label">FICO Score:</label>
          <input className="search-input" value={fico} onChange={(e) => setFico(e.target.value)} />
          <label className="search-label">Experience (# of rentals):</label>
          <input className="search-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <label className="search-label">Loan Amount:</label>
          <input className="search-input" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
          <label className="search-label">Property Type:</label>
          <select className="search-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="Single Family 1-4">Single Family 1-4</option>
            <option value="Condo">Condo</option>
            <option value="Townhome">Townhome</option>
            <option value="Manufactured">Manufactured</option>
            <option value="Cabins">Cabins</option>
          </select>
        </fieldset>

        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Borrower Profile</legend>
          <label className="search-label">State:</label>
          <input className="search-input" value={state} onChange={(e) => setState(e.target.value)} />
          <label className="search-label">Zipcode:</label>
          <input className="search-input" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
        </fieldset>
      </div>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Additional Filters</legend>
        <label className="search-label">Loan Term (months):</label>
        <input className="search-input" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} />
        <label className="search-label">Max LTV (%):</label>
        <input className="search-input" value={maxLTV} onChange={(e) => setMaxLTV(e.target.value)} />
        <label className="search-label">Max Portfolio Size:</label>
        <input className="search-input" value={maxPortfolioSize} onChange={(e) => setMaxPortfolioSize(e.target.value)} />
        <label className="search-label">Min DSCR:</label>
        <input className="search-input" value={minDSCR} onChange={(e) => setMinDSCR(e.target.value)} />
      </fieldset>

      <div className="search-buttons-container">
        <button className="search-button" onClick={handleSearch}>🔍 Search</button>
        <button className="search-button" onClick={handleClear}>🔄 New Search</button>
      </div>

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
