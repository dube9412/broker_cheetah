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

function FixAndFlipSearch() {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [fico, setFico] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [rehabNeeded, setRehabNeeded] = useState("");
  const [arv, setArv] = useState("");
  const [asisValue, setAsisValue] = useState("");
  const [experience, setExperience] = useState("");
  const [liquidity, setLiquidity] = useState("");
  const [recourse, setRecourse] = useState({ recourse: false, nonRecourse: false });
  const [interestType, setInterestType] = useState("");
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState("");

  const [results, setResults] = useState([]);
  const [warning, setWarning] = useState("");

  const handleSearch = async () => {
    setWarning("");

    const rehabAmount = parseFloat(rehabNeeded);
    const purchase = parseFloat(purchasePrice);

    if (rehabAmount && purchase && (rehabAmount > purchase || rehabAmount > 100000)) {
      setWarning("⚠️ Warning: Rehab may qualify as heavy based on size or cost. Some lenders may adjust terms.");
    }

    try {
      const queryString = new URLSearchParams({
        state,
        fico,
        purchasePrice,
        rehabNeeded,
        arv,
        asisValue,
        experience,
        liquidity,
        interestTypeDutch: interestType.dutch,
  interestTypeNonDutch: interestType.nonDutch,
        crossCollateralAllowed,
        recourse: recourse.recourse,
        nonRecourse: recourse.nonRecourse
      }).toString();

      const url = `${BASE_URL}/api/fix-and-flip/search?${queryString}`;
      console.log("🔍 Fetching:", url); // Debug

      const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text(); // Get raw error
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
    setPurchasePrice("");
    setRehabNeeded("");
    setArv("");
    setAsisValue("");
    setExperience("");
    setLiquidity("");
    setRecourse({ recourse: false, nonRecourse: false });
    setInterestType({ dutch: false, nonDutch: false });
    setCrossCollateralAllowed("");
    setResults([]);
    setWarning("");
  };
  

  return (
    <div className="search-container">
      <button className="back-button" onClick={() => navigate("/lender-search")}>🔙 Back to Loan Types</button>
      <h1 className="search-title">Fix & Flip Search</h1>
      <p className="search-subtitle">Enter one or more filters to find matching loan programs.</p>

      <div className="search-row">
        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Deal Details</legend>
          <label className="search-label">State:</label>
          <select className="search-select" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">-- Select a state --</option>
            {US_STATES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <label className="search-label">Purchase Price:</label>
          <input className="search-input" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
          <label className="search-label">Rehab Needed ($):</label>
          <input className="search-input" value={rehabNeeded} onChange={(e) => setRehabNeeded(e.target.value)} />
          <label className="search-label">ARV:</label>
          <input className="search-input" value={arv} onChange={(e) => setArv(e.target.value)} />
          <label className="search-label">As-Is Value:</label>
          <input className="search-input" value={asisValue} onChange={(e) => setAsisValue(e.target.value)} />
        </fieldset>

        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Borrower Profile</legend>
          <label className="search-label">FICO Score:</label>
          <input className="search-input" value={fico} onChange={(e) => setFico(e.target.value)} />
          <label className="search-label">Experience (Flips in past 36 mo):</label>
          <input className="search-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <label className="search-label">Liquidity (cash, stocks, etc.):</label>
          <input className="search-input" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} />
        </fieldset>
      </div>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Loan Options</legend>
        <label className="search-label">Recourse:</label>
        <label><input type="checkbox" checked={recourse.recourse} onChange={() => setRecourse((prev) => ({ ...prev, recourse: !prev.recourse }))} /> Recourse</label>
        <label><input type="checkbox" checked={recourse.nonRecourse} onChange={() => setRecourse((prev) => ({ ...prev, nonRecourse: !prev.nonRecourse }))} /> Non-Recourse</label>
        <label className="search-label">Interest Type:</label>
        <label><input type="checkbox" checked={interestType.dutch} onChange={() => setInterestType((prev) => ({ ...prev, dutch: !prev.dutch }))} /> Dutch</label>
        <label><input type="checkbox" checked={interestType.nonDutch} onChange={() => setInterestType((prev) => ({ ...prev, nonDutch: !prev.nonDutch }))} /> Non-Dutch</label>
        <label className="search-label">Cross Collateral Allowed:</label>
        <select className="search-select" value={crossCollateralAllowed} onChange={(e) => setCrossCollateralAllowed(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </fieldset>

      <div className="search-buttons-container">
        <button className="search-button" onClick={handleSearch}>🔍 Search</button>
        <button className="search-button" onClick={handleClear}>🔄 New Search</button>
      </div>

      {warning && <p className="search-warning">{warning}</p>}

      <div className="search-results">
        {results.map((res, i) => (
          <div key={i} className="search-result-item">
            <strong>✅ {res.name}</strong>
            <span>{res.phone || ""}</span>
            <p>Expect <strong>{res.maxLTC || "N/A"}%</strong> of purchase, <strong>{res.rehabPercent || "N/A"}%</strong> rehab, <strong>{res.termLengthMonths || "N/A"}-month</strong> term.</p>
            <p>Interest: <strong>{res.interestType || "Not Provided"}</strong> | Recourse: <strong>{res.recourse || "Not Provided"}</strong></p>
            <p>Rehab Classification: <strong>{res.rehabType || "Not Specified"}</strong></p>
            <p>📌 <em>Why this lender works:</em> {res.highlightNote || "Available Fix & Flip program"}</p>
            <label><input type="checkbox" value={res.lenderId} /> Request Quote</label>
          </div>
        ))}
      </div>

      <Glossary />
    </div>
  );
}

export default FixAndFlipSearch;
