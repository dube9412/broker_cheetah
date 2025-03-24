import React, { useState } from "react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

function FixAndFlipSearch() {
  const [state, setState] = useState("");
  const [fico, setFico] = useState("");
  const [numFlips, setNumFlips] = useState("");
  const [liquidity, setLiquidity] = useState("");

  const [purchasePrice, setPurchasePrice] = useState("");
  const [rehabNeeded, setRehabNeeded] = useState("");
  const [asIsValue, setAsIsValue] = useState("");
  const [arv, setArv] = useState("");

  const [interestType, setInterestType] = useState("");
  const [drawType, setDrawType] = useState("");
  const [recourse, setRecourse] = useState({ recourse: false, nonRecourse: false });
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState("");

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");

    try {
      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/search/fix-and-flip", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          state,
          fico,
          numFlips,
          liquidity,
          purchasePrice,
          rehabNeeded,
          asIsValue,
          arv,
          interestType,
          drawType,
          recourse,
          crossCollateralAllowed
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Server error");

      setResults(data.results || []);
    } catch (err) {
      console.error("❌ Search error:", err);
      setError("Search failed. See console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🔍 Fix & Flip Lender Search</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h4>🔹 Borrower Profile</h4>
      <label>State:</label>
      <select value={state} onChange={(e) => setState(e.target.value)}>
        <option value="">-- Select State --</option>
        {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>FICO:</label>
      <input type="number" value={fico} onChange={(e) => setFico(e.target.value)} />

      <label>Number of Flips:</label>
      <input type="number" value={numFlips} onChange={(e) => setNumFlips(e.target.value)} />

      <label>Liquidity:</label>
      <input type="number" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} />

      <h4>🔹 Deal Details</h4>
      <label>Purchase Price:</label>
      <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />

      <label>Rehab Needed:</label>
      <input type="number" value={rehabNeeded} onChange={(e) => setRehabNeeded(e.target.value)} />

      <label>As-Is Value:</label>
      <input type="number" value={asIsValue} onChange={(e) => setAsIsValue(e.target.value)} />

      <label>ARV:</label>
      <input type="number" value={arv} onChange={(e) => setArv(e.target.value)} />

      <h4>🔹 Loan Options</h4>
      <label>Interest Type:</label>
      <label><input type="radio" value="dutch" checked={interestType === "dutch"} onChange={(e) => setInterestType(e.target.value)} /> Dutch</label>
      <label><input type="radio" value="non-dutch" checked={interestType === "non-dutch"} onChange={(e) => setInterestType(e.target.value)} /> Non-Dutch</label>

      <label>Draw Type:</label>
      <label><input type="radio" value="dutch" checked={drawType === "dutch"} onChange={(e) => setDrawType(e.target.value)} /> Dutch</label>
      <label><input type="radio" value="non-dutch" checked={drawType === "non-dutch"} onChange={(e) => setDrawType(e.target.value)} /> Non-Dutch</label>

      <label>Recourse:</label>
      <label><input type="checkbox" checked={recourse.recourse} onChange={() => setRecourse(prev => ({ ...prev, recourse: !prev.recourse }))} /> Recourse</label>
      <label><input type="checkbox" checked={recourse.nonRecourse} onChange={() => setRecourse(prev => ({ ...prev, nonRecourse: !prev.nonRecourse }))} /> Non-Recourse</label>

      <label>Cross Collateral Allowed:</label>
      <select value={crossCollateralAllowed} onChange={(e) => setCrossCollateralAllowed(e.target.value)}>
        <option value="">-- Select --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <br /><br />
      <button onClick={handleSearch}>🔎 Search Lenders</button>

      {results.length > 0 && (
        <div>
          <h3>✅ Matching Lenders</h3>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {results.map((lender) => (
                <tr key={lender._id}>
                  <td>{lender.name}</td>
                  <td>{lender.contactName}</td>
                  <td>{lender.phone}</td>
                  <td>{lender.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FixAndFlipSearch;
