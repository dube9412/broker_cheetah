import React, { useState } from "react";

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
  const [drawType, setDrawType] = useState("");
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
      const response = await fetch(`/api/lenders/fixandflip?` + new URLSearchParams({
        state,
        fico,
        purchasePrice,
        rehabNeeded,
        arv,
        asisValue,
        experience,
        liquidity,
        interestType,
        drawType,
        crossCollateralAllowed,
        recourse: recourse.recourse,
        nonRecourse: recourse.nonRecourse
      }));

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setResults(data || []);
    } catch (err) {
      console.error("❌ Error searching:", err);
      setResults([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fix & Flip Filter</h2>
      <h1>Enter one or more fields</h1>

      <h4>🔹 Deal Details</h4>

      <label>State:</label>
      <input value={state} onChange={(e) => setState(e.target.value)} /><br /><br />
      <label>Purchase Price:</label>

      <input value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} /><br /><br />

      <label>Rehab Needed ($):</label>
      <input value={rehabNeeded} onChange={(e) => setRehabNeeded(e.target.value)} /><br /><br />

      <label>ARV:</label><br />
      <input value={arv} onChange={(e) => setArv(e.target.value)} /><br /><br />

      <label>As-Is Value:</label>
      
      <input value={asisValue} onChange={(e) => setAsisValue(e.target.value)} /><br /><br />

      <h4>🔹 Borrower Profile</h4>
      
      <label>FICO:</label>
      <input value={fico} onChange={(e) => setFico(e.target.value)} /><br /><br />

      <label>Experience (Past 36 mo):</label>
      <input value={experience} onChange={(e) => setExperience(e.target.value)} /><br /><br />

      <label>Liquidity Value (combined cash, stocks, bonds, retirement):</label>
      <input value={liquidity} onChange={(e) => setLiquidity(e.target.value)} /><br /><br />

      

      <h4>🔹 Loan Options</h4>

      <label>Recourse:</label>
      <input type="checkbox" checked={recourse.recourse} onChange={() => setRecourse((prev) => ({ ...prev, recourse: !prev.recourse }))} /> Recourse
      <input type="checkbox" checked={recourse.nonRecourse} onChange={() => setRecourse((prev) => ({ ...prev, nonRecourse: !prev.nonRecourse }))} /> Non-Recourse<br /><br />

      <label>Interest Type:</label>
      <label><input type="radio" name="interest" value="dutch" checked={interestType === "dutch"} onChange={(e) => setInterestType(e.target.value)} /> Dutch</label>
      <label><input type="radio" name="interest" value="non-dutch" checked={interestType === "non-dutch"} onChange={(e) => setInterestType(e.target.value)} /> Non-Dutch</label><br /><br />

      <label>Cross Collateral Allowed:</label>
      <select value={crossCollateralAllowed} onChange={(e) => setCrossCollateralAllowed(e.target.value)}>
        <option value="">-- Select --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select><br /><br />

      <button onClick={handleSearch}>🔍 Search</button><br /><br />

      {warning && <p style={{ color: "orange" }}>{warning}</p>}

      {results.length > 0 && (
        <div>
          <h3>Results</h3>
          <ul>
            {results.map((res, i) => (
              <li key={i}>{res.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FixAndFlipSearch;
