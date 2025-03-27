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

function FixAndFlipSearch() {
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Fix & Flip Search</h2>
      <p>Enter one or more filters to find matching loan programs.</p>

      {/* 🔹 Deal Details */}
      <fieldset style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <legend><strong>🔹 Deal Details</strong></legend>

        <label>State:
          <select value={state} onChange={(e) => setState(e.target.value)} style={{ width: "100%" }}>
            <option value="">-- Select a state --</option>
            {US_STATES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </label><br />

        <label>Purchase Price:
          <input value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Rehab Needed ($):
          <input value={rehabNeeded} onChange={(e) => setRehabNeeded(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>ARV:
          <input value={arv} onChange={(e) => setArv(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>As-Is Value:
          <input value={asisValue} onChange={(e) => setAsisValue(e.target.value)} style={{ width: "100%" }} />
        </label>
      </fieldset>

      {/* 🔹 Borrower Profile */}
      <fieldset style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <legend><strong>🔹 Borrower Profile</strong></legend>

        <label>FICO Score:
          <input value={fico} onChange={(e) => setFico(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Experience (Flips in past 36 mo):
          <input value={experience} onChange={(e) => setExperience(e.target.value)} style={{ width: "100%" }} />
        </label><br />

        <label>Liquidity (cash, stocks, etc.):
          <input value={liquidity} onChange={(e) => setLiquidity(e.target.value)} style={{ width: "100%" }} />
        </label>
      </fieldset>

      {/* 🔹 Loan Options */}
      <fieldset style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <legend><strong>🔹 Loan Options</strong></legend>

        <label>Recourse:</label>
        <label><input type="checkbox" checked={recourse.recourse} onChange={() => setRecourse((prev) => ({ ...prev, recourse: !prev.recourse }))} /> Recourse</label>
        <label><input type="checkbox" checked={recourse.nonRecourse} onChange={() => setRecourse((prev) => ({ ...prev, nonRecourse: !prev.nonRecourse }))} /> Non-Recourse</label><br />

        <label>Interest Type:</label>
        <label><input type="checkbox" checked={interestType.dutch} onChange={() => setInterestType((prev) => ({ ...prev, dutch: !prev.dutch }))} /> Dutch</label>
        <label><input type="checkbox" checked={interestType.nonDutch} onChange={() => setInterestType((prev) => ({ ...prev, nonDutch: !prev.nonDutch }))} /> Non-Dutch</label><br />

        <label>Cross Collateral Allowed:
          <select value={crossCollateralAllowed} onChange={(e) => setCrossCollateralAllowed(e.target.value)} style={{ width: "100%" }}>
            <option value="">-- Select --</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      </fieldset>

      <button onClick={handleSearch} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
        🔍 Search
      </button>
      <button onClick={handleClear} style={{ marginLeft: "10px" }}>
     🔄 New Search
</button>
<br /><br />

      {warning && <p style={{ color: "orange", fontWeight: "bold" }}>{warning}</p>}

      {results.length > 0 && (
  <div>
    <h3>Matching Lenders:</h3>
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      {results.map((res, i) => (
        <li
          key={i}
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <strong>✅ {res.name}</strong>{" "}
          <span style={{ fontSize: "0.9em" }}>{res.phone || ""}</span>
          <br />
          - Expect <strong>{res.maxLTC || "N/A"}%</strong> of purchase,{" "}
          <strong>{res.rehabPercent || "N/A"}%</strong> rehab,{" "}
          <strong>{res.termLengthMonths || "N/A"}-month</strong> term.
          <br />
          - Interest:{" "}
          <strong>{res.interestType || "Not Provided"}</strong> | Recourse:{" "}
          <strong>{res.recourse || "Not Provided"}</strong>
          <br />
          - Rehab Classification:{" "}
          <strong>{res.rehabType || "Not Specified"}</strong>
          <br />
          📌 <em>Why this lender works:</em>{" "}
          {res.highlightNote || "Available Fix & Flip program"}
          <br />
          <label>
            <input type="checkbox" value={res.lenderId} /> Request Quote
          </label>
        </li>
      ))}
    </ul>
  </div>
)}


      <main style={{ maxWidth: "80rem", marginTop: "40px" }}>
        <Glossary />
      </main>
    </div>
  );
}

export default FixAndFlipSearch;
