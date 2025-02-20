import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddPortfolio() {
  const { lenderId } = useParams();
  const navigate = useNavigate();
  const [lender, setLender] = useState(null);
  const [numTiers, setNumTiers] = useState(1); // Default to 1 tier
  const [tiers, setTiers] = useState([{ minFICO: "", maxLTV: "", maxPortfolioSize: "" }]);
  const [loanRange, setLoanRange] = useState({ min: "", max: "" });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loanTerm, setLoanTerm] = useState("");

  const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];

 

  useEffect(() => {
    const fetchLender = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`);
        const data = await response.json();
        setLender(data);
      } catch (error) {
        console.error("Error fetching lender details:", error);
      }
    };
    fetchLender();
  }, [lenderId]);

  const handleNumTiersChange = (e) => {
    const newNumTiers = parseInt(e.target.value) || 1;
    setNumTiers(newNumTiers);
    setTiers((prevTiers) => {
      const newTiers = [...prevTiers];
      if (newNumTiers > prevTiers.length) {
        for (let i = prevTiers.length; i < newNumTiers; i++) {
          newTiers.push({ minFICO: "", maxLTV: "", minExperience: "", maxPortfolioSize: "" });
        }
      } else {
        newTiers.length = newNumTiers;
      }
      return newTiers;
    });
  };

  const handleTierChange = (index, field, value) => {
    setTiers((prevTiers) => {
      const updatedTiers = [...prevTiers];
      updatedTiers[index][field] = value;
      return updatedTiers;
    });
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedLoanRange = {
      min: loanRange.min ? parseInt(loanRange.min) : undefined,
      max: loanRange.max ? parseInt(loanRange.max) : undefined,
    };

    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/portfolio/${lenderId}/portfolio-programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Portfolio Loan Program",
          type: "portfolio",
          lender: lenderId,
          loanRange: formattedLoanRange,
          propertyTypes: propertyTypes,
          loanTerm,
          tiers,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Portfolio Loan program added successfully!");
        navigate(`/manage-loan-programs/${lenderId}`);
      } else {
        alert(`Failed to add program: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding Portfolio Loan program:", error);
      alert("An error occurred while adding the program.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>
        {lender ? `Adding Portfolio Loan Program for ${lender.name}` : "Loading Lender..."}
      </h2>

      <form onSubmit={handleSubmit}>
      <label>Number of Tiers:</label>
        <select value={numTiers} onChange={handleNumTiersChange} style={{ width: "100%", marginBottom: "10px" }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        {tiers.map((tier, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>Tier {index + 1}</h3>
            <label>Minimum FICO:</label>
            <input type="number" value={tier.minFICO} onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Maximum LTV (%):</label>
            <input type="number" value={tier.maxLTV} onChange={(e) => handleTierChange(index, "maxLTV", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Minimum Experience (in months):</label>
            <input type="number" value={tier.minExperience} onChange={(e) => handleTierChange(index, "minExperience", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Maximum Portfolio Size:</label>
            <input type="number" value={tier.maxPortfolioSize} onChange={(e) => handleTierChange(index, "maxPortfolioSize", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
          </div>
        ))}
        <label>Loan Range:</label>
          <input type="number" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} style={{ width: "45%", marginRight: "10px" }} />
          <input type="number" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} style={{ width: "45%" }} />
        <label>Property Types:</label>
        <div>
  {PROPERTY_TYPES.map((type) => (
    <label key={type}>
      <input
        type="checkbox"
        value={type}
        checked={propertyTypes.includes(type)}
        onChange={() => handlePropertyTypeChange(type)} // ✅ Using the function here
      />
      {type}
    </label>
  ))}
</div>
<label>Loan Term:</label>
        <input type="text" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
        <br />


        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button type="submit" style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>
            Save Program
          </button>
          <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} type="button" style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPortfolio;


