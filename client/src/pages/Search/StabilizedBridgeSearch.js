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

function SearchStabilizedBridge() {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [dscrRatio, setDscrRatio] = useState("");
  const [results, setResults] = useState([]);
  const [warning, setWarning] = useState("");

  const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];

  const handleSearch = async () => {
    setWarning("");

    try {
      const queryString = new URLSearchParams({
        state,
        zipCode,
        fico,
        experience,
        loanAmount,
        propertyType,
        dscrRatio,
      }).toString();

      const url = `${BASE_URL}/api/stabilized-bridge/search?${queryString}`;
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
    setZipCode("");
    setFico("");
    setExperience("");
    setLoanAmount("");
    setPropertyType("");
    setDscrRatio("");
    setResults([]);
    setWarning("");
  };

  return (
    <div className="search-container">
      <button className="back-button" onClick={() => navigate("/lender-search")}>🔙 Back to Loan Types</button>
      <h1 className="search-title">Stabilized Bridge Search</h1>
      <p className="search-subtitle">Enter one or more filters to find matching loan programs.</p>

      <div className="search-row">
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

          <label>ZIP Code:
            <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} style={{ width: "100%" }} />
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
        </fieldset>

        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Borrower Profile</legend>

          <label>FICO Score:
            <input value={fico} onChange={(e) => setFico(e.target.value)} style={{ width: "100%" }} />
          </label><br />

          <label>Experience (# of deals):
            <input value={experience} onChange={(e) => setExperience(e.target.value)} style={{ width: "100%" }} />
          </label><br />

          <label>Min DSCR Ratio:
            <input value={dscrRatio} onChange={(e) => setDscrRatio(e.target.value)} style={{ width: "100%" }} />
          </label>
        </fieldset>
      </div>

      <button className="search-button" onClick={handleSearch}>🔍 Search</button>
      <button className="search-button" onClick={handleClear} style={{ marginLeft: "10px" }}>🔄 New Search</button>

      {warning && <p className="search-warning">{warning}</p>}

      <div className="search-results">
        {results.map((res, i) => (
          <div key={i} className="search-result-item">
            <strong>✅ {res.lenderName}</strong>
            <span style={{ fontSize: "0.9em" }}>{res.lenderPhone || ""}</span>
            <br />
            - Max LTV: <strong>{res.maxLTV || "N/A"}%</strong>, Min DSCR: <strong>{res.minDSCR || "N/A"}</strong>
            <br />
            - Loan Term: <strong>{res.loanTerm || "N/A"} months</strong>
            <br />
            - Loan Range: <strong>${res.loanRange?.min || "N/A"} - ${res.loanRange?.max || "N/A"}</strong>
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

export default SearchStabilizedBridge;
