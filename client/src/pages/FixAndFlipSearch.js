import React, { useState, useEffect } from "react";

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
  const [error, setError] = useState(""); // NEW: To catch any errors

  useEffect(() => {
    console.log("FixAndFlipSearch Mounted"); // DEBUG
  }, []);

  const handleSearch = () => {
    setError(""); // Reset errors
    console.log("Search initiated..."); // DEBUG

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
        console.log("Matching lenders:", lenders);
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
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Error Display */}
      
      <div>
        <label>State: </label>
        <input value={state} onChange={(e) => setState(e.target.value)} />
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
        <label>Current Value: </label>
        <input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
      </div>
      <div>
        <label>Rehab Needed: </label>
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


