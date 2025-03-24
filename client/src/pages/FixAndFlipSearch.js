import React, { useState } from "react";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

function FixAndFlipSearch() {
  const [state, setState] = useState("");
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [rehabAmount, setRehabAmount] = useState("");
  const [arv, setArv] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [liquidity, setLiquidity] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    const params = new URLSearchParams({
      state,
      fico,
      experience,
      purchasePrice,
      rehabAmount,
      arv,
      currentValue,
      liquidity,
    });

    try {
      const res = await fetch(`/api/lenders/fixandflip?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed.");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("❌ Error searching:", err);
      setError("Error occurred during search.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h2>🔍 Fix & Flip Search</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>State:</label>
      <select value={state} onChange={(e) => setState(e.target.value)}>
        <option value="">-- Select State --</option>
        {US_STATES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <label>FICO Score:</label>
      <input type="number" value={fico} onChange={(e) => setFico(e.target.value)} />

      <label>Number of Flips (Experience):</label>
      <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />

      <label>Purchase Price:</label>
      <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />

      <label>Rehab Amount Needed:</label>
      <input type="number" value={rehabAmount} onChange={(e) => setRehabAmount(e.target.value)} />

      <label>ARV (After Repair Value):</label>
      <input type="number" value={arv} onChange={(e) => setArv(e.target.value)} />

      <label>As-Is Value (Current):</label>
      <input type="number" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />

      <label>Liquidity:</label>
      <input type="number" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} />

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button onClick={handleSearch} style={{ padding: "10px 20px" }}>Search</button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Matching Lenders</h3>
          <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Lender Name</th>
                <th>Contact</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {results.map((lender) => (
                <tr key={lender._id}>
                  <td>{lender.name}</td>
                  <td>{lender.contactName}</td>
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
