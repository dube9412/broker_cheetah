import React, { useState } from "react";

function SearchGroundUp() {
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        fico,
        experience,
        loanAmount,
        propertyType,
        termMonths,
        zipCode,
      });

      const res = await fetch(`https://broker-cheetah-backend.onrender.com/api/ground-up/search?${params}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("❌ Error searching Ground Up programs:", error);
      alert("Search failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Ground Up Loan Programs</h2>

      <label>FICO Score:
        <input value={fico} onChange={(e) => setFico(e.target.value)} />
      </label><br />

      <label>Experience (months):
        <input value={experience} onChange={(e) => setExperience(e.target.value)} />
      </label><br />

      <label>Loan Amount:
        <input value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
      </label><br />

      <label>Property Type:
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Single Family 1-4">Single Family 1-4</option>
          <option value="Condo">Condo</option>
          <option value="Townhome">Townhome</option>
          <option value="Manufactured">Manufactured</option>
          <option value="Cabins">Cabins</option>
        </select>
      </label><br />

      <label>Loan Term (Months):
        <input value={termMonths} onChange={(e) => setTermMonths(e.target.value)} />
      </label><br />

      <label>Zip Code:
        <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
      </label><br />

      <button onClick={handleSearch}>Search</button>

      <hr />
      <h3>Results:</h3>
      {results.length === 0 && <p>No matching programs.</p>}
      {results.map((program, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <strong>Lender:</strong> {program.lenderName} <br />
          <strong>Loan Range:</strong> ${program.loanRange?.min || "?"} - ${program.loanRange?.max || "?"} <br />
          <strong>Max LTV:</strong> {program.maxLTV || "N/A"} <br />
          <strong>Max LTC:</strong> {program.maxLTC || "N/A"} <br />
          <strong>Construction Budget:</strong> ${program.constructionBudget || "N/A"} <br />
          <strong>Term:</strong> {program.termMonths || "N/A"} months
        </div>
      ))}
    </div>
  );
}

export default SearchGroundUp;
