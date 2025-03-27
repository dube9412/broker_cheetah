import React, { useState } from "react";
import Glossary from "../../components/hardMoneyClass/Glossary";

const BASE_URL = "https://broker-cheetah-backend.onrender.com";

const US_STATES = [
  "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
  "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME",
  "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM",
  "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
  "UT", "VA", "VT", "WA", "WI", "WV", "WY"
];


function SearchStabilizedBridge() {
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [dscrRatio, setDscrRatio] = useState("");
  const [results, setResults] = useState([]);

  const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        state,
        zipCode,
        fico,
        experience,
        loanAmount,
        propertyType,
        dscrRatio
      });

      const res = await fetch(`https://broker-cheetah-backend.onrender.com/api/stabilized-bridge/search?${params}`);
      const data = await res.json();

      setResults(data);
    } catch (error) {
      console.error("❌ Error searching Stabilized Bridge programs:", error);
      alert("Search failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Stabilized Bridge Programs</h2>

      <label>State:
        <input value={state} onChange={(e) => setState(e.target.value)} />
      </label><br />

      <label>ZIP Code:
        <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
      </label><br />

      <label>FICO Score:
        <input value={fico} onChange={(e) => setFico(e.target.value)} />
      </label><br />

      <label>Experience (# of deals):
        <input value={experience} onChange={(e) => setExperience(e.target.value)} />
      </label><br />

      <label>Loan Amount:
        <input value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
      </label><br />

      <label>Property Type:
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">-- Select --</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label><br />

      <label>Min DSCR Ratio:
        <input value={dscrRatio} onChange={(e) => setDscrRatio(e.target.value)} />
      </label><br />

      <button onClick={handleSearch}>Search</button>

      <hr />
      <h3>Results:</h3>
      {results.length === 0 && <p>No matching programs.</p>}
      {results.map((program, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <strong>Lender:</strong> {program.lenderName} <br />
          <strong>Max LTV:</strong> {program.maxLTV || "N/A"} <br />
          <strong>Min DSCR:</strong> {program.minDSCR || "N/A"} <br />
          <strong>Loan Term:</strong> {program.loanTerm || "N/A"} months <br />
          <strong>Loan Range:</strong> ${program.loanRangeMin || "N/A"} - ${program.loanRangeMax || "N/A"}
        </div>
      ))}
       <main style={{ maxWidth: "80rem", marginTop: "40px" }}>
        <Glossary />
      </main>
    </div>
  );
}

export default SearchStabilizedBridge;
