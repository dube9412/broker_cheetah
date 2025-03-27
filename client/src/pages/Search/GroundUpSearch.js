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

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Deal Details</legend>

        <label>State:
          <select value={state} onChange={(e) => setState(e.target.value)} style={{ width: "100%" }}>
            <option value="">-- Select a state --</option>
            {US_STATES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </label><br />

        <label>Loan Amount:
          <input value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Property Type:
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} style={{ width: "100%" }}>
            <option value="">-- Select --</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label><br />

        <label>Construction Budget:
          <input value={constructionBudget} onChange={(e) => setConstructionBudget(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Loan Term (Months):
          <input value={termMonths} onChange={(e) => setTermMonths(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>ZIP Code:
          <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} style={{ width: "100%" }} />
        </label>
      </fieldset>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Borrower Profile</legend>

        <label>FICO Score:
          <input value={fico} onChange={(e) => setFico(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Experience (months):
          <input value={experience} onChange={(e) => setExperience(e.target.value)} style={{ width: "100%" }} />
        </label>
      </fieldset>

      <button className="search-button" onClick={handleSearch}>🔍 Search</button>
      <button className="search-button" onClick={handleClear} style={{ marginLeft: "10px" }}>🔄 New Search</button>

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
