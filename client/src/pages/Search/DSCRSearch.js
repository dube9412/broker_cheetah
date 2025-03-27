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

function DSCRSearch() {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyUse, setPropertyUse] = useState("");
  const [currentRent, setCurrentRent] = useState("");
  const [marketRent, setMarketRent] = useState("");
  const [taxes, setTaxes] = useState("");
  const [insurance, setInsurance] = useState("");
  const [hoaFees, setHoaFees] = useState("");
  const [prepaymentPeriod, setPrepaymentPeriod] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        state,
        fico,
        experience,
        loanAmount,
        propertyType,
        propertyUse,
        currentRent,
        marketRent,
        taxes,
        insurance,
        hoaFees,
        prepaymentPeriod,
      });

      const res = await fetch(`${BASE_URL}/api/dscr/search?${params}`);
      const data = await res.json();

      setResults(data);
    } catch (error) {
      console.error("❌ Error searching DSCR programs:", error);
      alert("Search failed.");
    }
  };

  const handleClear = () => {
    setState("");
    setFico("");
    setExperience("");
    setLoanAmount("");
    setPropertyType("");
    setPropertyUse("");
    setCurrentRent("");
    setMarketRent("");
    setTaxes("");
    setInsurance("");
    setHoaFees("");
    setPrepaymentPeriod("");
    setResults([]);
  };

  return (
    <div className="search-container">
      <button className="back-button" onClick={() => navigate("/lender-search")}>🔙 Back to Loan Types</button>
      <h1 className="search-title">DSCR Loan Search</h1>
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
            <option value="Single Family 1-4">Single Family 1-4</option>
            <option value="Condo">Condo</option>
            <option value="Townhome">Townhome</option>
            <option value="Manufactured">Manufactured</option>
            <option value="Cabins">Cabins</option>
          </select>
        </label><br />

        <label>Property Use:
          <select value={propertyUse} onChange={(e) => setPropertyUse(e.target.value)} style={{ width: "100%" }}>
            <option value="">-- Select --</option>
            <option value="Standard Rental">Standard Rental</option>
            <option value="Short Term Rental">Short Term Rental</option>
            <option value="Vacant">Vacant</option>
          </select>
        </label>
      </fieldset>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Borrower Profile</legend>

        <label>FICO Score:
          <input value={fico} onChange={(e) => setFico(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Experience (# of rentals):
          <input value={experience} onChange={(e) => setExperience(e.target.value)} style={{ width: "100%" }} />
        </label>
      </fieldset>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 DSCR Calculation Inputs</legend>

        <label>Current Rent ($):
          <input value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Market Rent ($):
          <input value={marketRent} onChange={(e) => setMarketRent(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Taxes ($/year):
          <input value={taxes} onChange={(e) => setTaxes(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Insurance ($/year):
          <input value={insurance} onChange={(e) => setInsurance(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>HOA Fees ($/month):
          <input value={hoaFees} onChange={(e) => setHoaFees(e.target.value)} style={{ width: "100%" }} />
        </label>
      </fieldset>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Loan Options</legend>

        <label>Prepayment Period:
          <input value={prepaymentPeriod} onChange={(e) => setPrepaymentPeriod(e.target.value)} style={{ width: "100%" }} />
        </label>
      </fieldset>

      <button className="search-button" onClick={handleSearch}>🔍 Search</button>
      <button className="search-button" onClick={handleClear} style={{ marginLeft: "10px" }}>🔄 New Search</button>

      <div className="search-results">
        {results.length === 0 && <p>No matching programs.</p>}
        {results.map((program, i) => (
          <div key={i} className="search-result-item">
            <strong>✅ {program.lenderName}</strong> <br />
            <strong>Loan Range:</strong> ${program.loanRange?.min || "N/A"} - ${program.loanRange?.max || "N/A"} <br />
            <strong>PPP:</strong> {program.prepaymentPeriod || "N/A"} <br />
            <strong>Max LTV (Purchase):</strong> {program.maxLTVPurchase || "N/A"} <br />
            <strong>DSCR Min:</strong> {program.dscrRatioMin || "N/A"}
          </div>
        ))}
      </div>

      <Glossary />
    </div>
  );
}

export default DSCRSearch;
