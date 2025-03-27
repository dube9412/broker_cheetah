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

function SearchGroundUp() {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [constructionBudget, setConstructionBudget] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [results, setResults] = useState([]);
  const [warning, setWarning] = useState("");

  const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];

  const handleSearch = async () => {
    setWarning("");

    try {
      const queryString = new URLSearchParams({
        state,
        fico,
        experience,
        loanAmount,
        propertyType,
        constructionBudget,
        termMonths,
        zipCode,
      }).toString();

      const url = `${BASE_URL}/api/ground-up/search?${queryString}`;
      console.log("🔍 Fetching:", url);

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`❌ Status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResults(data || []);
    } catch (err) {
      console.error("❌ Error searching:", err.message);
      setResults([]);
    }
  };

  const handleClear = () => {
    setState("");
    setFico("");
    setExperience("");
    setLoanAmount("");
    setPropertyType("");
    setConstructionBudget("");
    setTermMonths("");
    setZipCode("");
    setResults([]);
    setWarning("");
  };

  return (
    <div className="search-container">
      <button className="back-button" onClick={() => navigate("/lender-search")}>🔙 Back to Loan Types</button>
      <h1 className="search-title">Ground Up Search</h1>
      <p className="search-subtitle">Enter one or more filters to find matching loan programs.</p>

      <div className="search-row">
        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Deal Details</legend>

          <label>State:
            <select className="search-select" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">-- Select a state --</option>
              {US_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </label><br />

          <label>Loan Amount:
            <input className="search-input" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
          </label><br />

          <label>Property Type:
            <select className="search-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              <option value="">-- Select --</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label><br />

          <label>Construction Budget:
            <input className="search-input" value={constructionBudget} onChange={(e) => setConstructionBudget(e.target.value)} />
          </label><br />

          <label>Loan Term (Months):
            <input className="search-input" value={termMonths} onChange={(e) => setTermMonths(e.target.value)} />
          </label><br />

          <label>ZIP Code:
            <input className="search-input" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
          </label>
        </fieldset>

        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Borrower Profile</legend>

          <label>FICO Score:
            <input className="search-input" value={fico} onChange={(e) => setFico(e.target.value)} />
          </label><br />

          <label>Experience (months):
            <input className="search-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
          </label>
        </fieldset>
      </div>

      <div className="search-buttons-container">
        <button className="search-button" onClick={handleSearch}>🔍 Search</button>
        <button className="search-button" onClick={handleClear}>🔄 New Search</button>
      </div>

      {warning && <p className="search-warning">{warning}</p>}

      <div className="search-results">
        {results.map((res, i) => (
          <div key={i} className="search-result-item">
            <strong>✅ {res.lenderName}</strong>
            <span style={{ fontSize: "0.9em" }}>{res.lenderPhone || ""}</span>
            <br />
            - Max LTV: <strong>{res.maxLTV || "N/A"}%</strong>, Max LTC: <strong>{res.maxLTC || "N/A"}%</strong>
            <br />
            - Loan Term: <strong>{res.termMonths || "N/A"} months</strong>
            <br />
            - Construction Budget: <strong>${res.constructionBudget || "N/A"}</strong>
            <br />
            <label>
              <input type="checkbox" value={res.lenderId} /> Request Quote
            </label>
          </div>
        ))}
      </div>

      <Glossary />
    </div>
  );
}

export default SearchGroundUp;
