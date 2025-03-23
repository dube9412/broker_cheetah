
import React, { useState } from "react";

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

function FixAndFlipSearch() {
  const [state, setState] = useState("");
  const [fico, setFico] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseMoneySought, setPurchaseMoneySought] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [rehabNeeded, setRehabNeeded] = useState("");
  const [arv, setArv] = useState("");
  const [liquidity, setLiquidity] = useState("");
  const [numFlips, setNumFlips] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");

    const params = new URLSearchParams({
      state,
      fico,
      purchasePrice,
      purchaseMoneySought,
      currentValue,
      rehabNeeded,
      arv,
      liquidity,
      numFlips,
    });

    fetch(`/api/lenders/fixandflip?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lenders");
        return res.json();
      })
      .then((lenders) => {
        setResults(lenders);
      })
      .catch((err) => {
        console.error("Error fetching lenders:", err);
        setError("Error fetching lenders. Please check console for details.");
      });
  };

  return (
    <div>
      <h2>Fix & Flip Search</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>State: </label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">-- Select State --</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label>FICO: </label>
        <input value={fico} onChange={(e) => setFico(e.target.value)} />
      </div>
      <div>
        <label>Total Purchase Price: </label>
        <input value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
      </div>
      <div>
        <label>Purchase Money Sought: </label>
        <input value={purchaseMoneySought} onChange={(e) => setPurchaseMoneySought(e.target.value)} />
      </div>
      <div>
        <label>Current Value (As-Is): </label>
        <input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
      </div>
      <div>
        <label>Rehab Needed ($): </label>
        <input value={rehabNeeded} onChange={(e) => setRehabNeeded(e.target.value)} />
      </div>
      <div>
        <label>ARV (After Repair Value): </label>
        <input value={arv} onChange={(e) => setArv(e.target.value)} />
      </div>
      <div>
        <label>Liquidity: </label>
        <input value={liquidity} onChange={(e) => setLiquidity(e.target.value)} />
      </div>
      <div>
        <label>Number of Flips: </label>
        <input value={numFlips} onChange={(e) => setNumFlips(e.target.value)} />
      </div>

      <button onClick={handleSearch} style={{ marginTop: "1rem" }}>Search</button>

      {results.length > 0 && (
        <div>
          <h3>Matching Lenders</h3>
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
