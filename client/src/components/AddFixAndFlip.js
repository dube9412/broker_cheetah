import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddFixAndFlip() {
  const { lenderId } = useParams();
  const navigate = useNavigate();

  const [lender, setLender] = useState(null);
  const [numTiers, setNumTiers] = useState(1);
  const [experienceWindowMonths, setExperienceWindowMonths] = useState("");
  const [minAsIsValue, setMinAsIsValue] = useState("");
  const [termLengthMonths, setTermLengthMonths] = useState("");
  const [recourse, setRecourse] = useState({ recourse: false, nonRecourse: false });
  const [interestType, setInterestType] = useState("");
  const [drawType, setDrawType] = useState("");
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [tiers, setTiers] = useState([
    {
      tierName: "",
      minFICO: "",
      minExperience: "",
      loanRange: { min: "", max: "" },
      maxLTC: "",
      totalLTC: "",
      maxARV: "",
      rehabPercent: "",
    },
  ]);

  const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];

  useEffect(() => {
    const fetchLender = async () => {
      const res = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`);
      const data = await res.json();
      setLender(data);
    };
    fetchLender();
  }, [lenderId]);

  const handleNumTiersChange = (e) => {
    const count = parseInt(e.target.value);
    const newTiers = [...tiers];
    while (newTiers.length < count) {
      newTiers.push({
        tierName: "",
        minFICO: "",
        minExperience: "",
        loanRange: { min: "", max: "" },
        maxLTC: "",
        totalLTC: "",
        maxARV: "",
        rehabPercent: "",
      });
    }
    setTiers(newTiers.slice(0, count));
    setNumTiers(count);
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...tiers];
    updated[index][field] = value;
    setTiers(updated);
  };

  const handleLoanRangeChange = (index, bound, value) => {
    const updated = [...tiers];
    updated[index].loanRange[bound] = value;
    setTiers(updated);
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleRecourseChange = (type) => {
    setRecourse((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: "Fix and Flip",
      type: "Fix and Flip",
      lender: lenderId,
      experienceWindowMonths: parseInt(experienceWindowMonths),
      minAsIsValue: parseFloat(minAsIsValue),
      termLengthMonths: parseInt(termLengthMonths),
      recourse,
      interestType,
      drawType,
      crossCollateralAllowed,
      propertyTypes,
      tiers,
    };

    const res = await fetch(`https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Fix & Flip program added!");
      navigate(`/manage-loan-programs/${lenderId}`);
    } else {
      console.error("❌ Submission error:", data);
      alert("Failed to submit.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>{lender?.name ? `Add Fix & Flip for ${lender.name}` : "Loading lender..."}</h2>

      <form onSubmit={handleSubmit}>
        <label>Experience Window (Months):</label>
        <input type="number" value={experienceWindowMonths} onChange={(e) => setExperienceWindowMonths(e.target.value)} />
    
        <label>Min As-Is Property Value:</label>
        <input type="number" value={minAsIsValue} onChange={(e) => setMinAsIsValue(e.target.value)} />

        <label>Term Length (Months):</label>
        <input type="number" value={termLengthMonths} onChange={(e) => setTermLengthMonths(e.target.value)} />

        <label>Recourse Options:</label>
        <label><input type="checkbox" checked={recourse.recourse} onChange={() => handleRecourseChange("recourse")} /> Recourse</label>
        <label><input type="checkbox" checked={recourse.nonRecourse} onChange={() => handleRecourseChange("nonRecourse")} /> Non-Recourse</label>

        <label>Interest Type:</label>
        <label><input type="radio" value="dutch" checked={interestType === "dutch"} onChange={(e) => setInterestType(e.target.value)} /> Dutch</label>
        <label><input type="radio" value="non-dutch" checked={interestType === "non-dutch"} onChange={(e) => setInterestType(e.target.value)} /> Non-Dutch</label>

        <label>Draw Type:</label>
        <label><input type="radio" value="dutch" checked={drawType === "dutch"} onChange={(e) => setDrawType(e.target.value)} /> Dutch</label>
        <label><input type="radio" value="non-dutch" checked={drawType === "non-dutch"} onChange={(e) => setDrawType(e.target.value)} /> Non-Dutch</label>

        <label>Cross Collateral Allowed:</label>
        <select value={crossCollateralAllowed} onChange={(e) => setCrossCollateralAllowed(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <label>Property Types:</label>
        {PROPERTY_TYPES.map((type) => (
          <label key={type}>
            <input type="checkbox" checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} />
            {type}
          </label>
        ))}

        <label>Number of Tiers:</label>
        <select value={numTiers} onChange={handleNumTiersChange}>
          {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)}
        </select>

        {tiers.map((tier, i) => (
          <div key={i} style={{ border: "1px solid gray", margin: "10px 0", padding: "10px" }}>
            <h4>Tier {i + 1}</h4>
            <input placeholder="Tier Name" value={tier.tierName} onChange={(e) => handleTierChange(i, "tierName", e.target.value)} />
            <input placeholder="Min FICO" value={tier.minFICO} onChange={(e) => handleTierChange(i, "minFICO", e.target.value)} />
            <input placeholder="Min Experience" value={tier.minExperience} onChange={(e) => handleTierChange(i, "minExperience", e.target.value)} />

            <input placeholder="Loan Range Min" value={tier.loanRange.min} onChange={(e) => handleLoanRangeChange(i, "min", e.target.value)} />
            <input placeholder="Loan Range Max" value={tier.loanRange.max} onChange={(e) => handleLoanRangeChange(i, "max", e.target.value)} />

            <input placeholder="Max LTC" value={tier.maxLTC} onChange={(e) => handleTierChange(i, "maxLTC", e.target.value)} />
            <input placeholder="Total LTC" value={tier.totalLTC} onChange={(e) => handleTierChange(i, "totalLTC", e.target.value)} />
            <input placeholder="Max ARV" value={tier.maxARV} onChange={(e) => handleTierChange(i, "maxARV", e.target.value)} />
            <input placeholder="Rehab % Covered" value={tier.rehabPercent} onChange={(e) => handleTierChange(i, "rehabPercent", e.target.value)} />
          </div>
        ))}

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button type="submit" style={{ marginRight: "10px" }}>Save Program</button>
          <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddFixAndFlip;
