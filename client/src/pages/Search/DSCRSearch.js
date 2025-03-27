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


function SearchDSCR() {
  const [fico, setFico] = useState("");
  const [experience, setExperience] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyUse, setPropertyUse] = useState("");
  const [prepaymentPeriod, setPrepaymentPeriod] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        fico,
        experience,
        loanAmount,
        propertyType,
        propertyUse,
        prepaymentPeriod,
      });

      const res = await fetch(`https://broker-cheetah-backend.onrender.com/api/dscr/search?${params}`);
      const data = await res.json();

      setResults(data);
    } catch (error) {
      console.error("❌ Error searching DSCR programs:", error);
      alert("Search failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search DSCR Loan Programs</h2>

      <label>FICO Score:
        <input value={fico} onChange={(e) => setFico(e.target.value)} />
      </label><br />

      <label>Experience (# of rentals):
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

      <label>Property Use:
        <select value={propertyUse} onChange={(e) => setPropertyUse(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Standard Rental">Standard Rental</option>
          <option value="Short Term Rental">Short Term Rental</option>
          <option value="Vacant">Vacant</option>
        </select>
      </label><br />

      <label>Prepayment Period:
        <input value={prepaymentPeriod} onChange={(e) => setPrepaymentPeriod(e.target.value)} />
      </label><br />

      <button onClick={handleSearch}>Search</button>

      <hr />
      <h3>Results:</h3>
      {results.length === 0 && <p>No matching programs.</p>}
      {results.map((program, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <strong>Lender:</strong> {program.lenderName} <br />
          <strong>Loan Range:</strong> ${program.loanRange?.min || "N/A"} - ${program.loanRange?.max || "N/A"}
            <br />
          <strong>PPP:</strong> {program.prepaymentPeriod || "N/A"} <br />
          <strong>Max LTV (Purchase):</strong> {program.maxLTVPurchase || "N/A"} <br />
          <strong>DSCR Min:</strong> {program.dscrRatioMin || "N/A"}
        </div>
      ))}
       <main style={{ maxWidth: "80rem", marginTop: "40px" }}>
        <Glossary />
      </main>
    </div>
  );
}

export default SearchDSCR;
