import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddFixAndFlip() {
  const { lenderId } = useParams();
  const navigate = useNavigate();

  const [lender, setLender] = useState(null);
  const [numTiers, setNumTiers] = useState(1);
  const [experienceWindowMonths, setExperienceWindowMonths] = useState("");
  const [minAsIsValue, setMinAsIsValue] = useState("");
  const [loanRange, setLoanRange] = useState({ min: "", max: "" });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [rehabTypeDefinition, setRehabTypeDefinition] = useState({
    method: "percentage",
    threshold: "",
    
  });

  const [tiers, setTiers] = useState([
    {
      tierName: "",
      minFICO: "",
      minExperience: "",
      loanRange: { min: "", max: "" },
      rehabTypeAdjustments: {
        light: { maxLTP: "", totalLTC: "", maxARV: "" },
        medium: { maxLTP: "", totalLTC: "", maxARV: "" },
        heavy: { maxLTP: "", totalLTC: "", maxARV: "" },
      }
    }
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
    const newCount = parseInt(e.target.value);
    const updatedTiers = [...tiers];
    while (updatedTiers.length < newCount) {
      updatedTiers.push({
        tierName: "",
        minFICO: "",
        minExperience: "",
        loanRange: { min: "", max: "" },
        rehabTypeAdjustments: {
          light: { maxLTP: "", totalLTC: "", maxARV: "" },
          medium: { maxLTP: "", totalLTC: "", maxARV: "" },
          heavy: { maxLTP: "", totalLTC: "", maxARV: "" },
        }
      });
    }
    setTiers(updatedTiers.slice(0, newCount));
    setNumTiers(newCount);
  };

  const handleTierChange = (i, field, value) => {
    const newTiers = [...tiers];
    newTiers[i][field] = value;
    setTiers(newTiers);
  };

  const handleNestedChange = (i, level, subField, value) => {
    const updatedTiers = [...tiers];
    updatedTiers[i].rehabTypeAdjustments[level][subField] = value;
    setTiers(updatedTiers);
  };

  const handleLoanRangeChange = (i, bound, value) => {
    const updatedTiers = [...tiers];
    updatedTiers[i].loanRange[bound] = value;
    setTiers(updatedTiers);
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: "Fix and Flip",
      type: "Fix and Flip",
      lender: lenderId,
      experienceWindowMonths: parseInt(experienceWindowMonths),
      minAsIsValue: parseFloat(minAsIsValue),
      rehabTypeDefinition: {
        method: rehabTypeDefinition.method,
        threshold: parseFloat(rehabTypeDefinition.threshold)
      },
      loanRange: {
        min: parseFloat(loanRange.min),
        max: parseFloat(loanRange.max),
      },
      propertyTypes,
      tiers
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

        <label>Rehab Definition Method:</label>
        <select value={rehabTypeDefinition.method} onChange={(e) => setRehabTypeDefinition({ ...rehabTypeDefinition, method: e.target.value })}>
          <option value="percentage">By Percentage</option>
          <option value="sowChecklist">Scope of Work Checklist</option>
        </select>

        <label>Rehab Threshold % (if percentage):</label>
        <input type="number" value={rehabTypeDefinition.threshold} onChange={(e) => setRehabTypeDefinition({ ...rehabTypeDefinition, threshold: e.target.value })} />

        <label>Loan Range:</label>
        <input placeholder="Min" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} />
        <input placeholder="Max" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} />

        <label>Property Types:</label>
        {PROPERTY_TYPES.map((type) => (
          <label key={type}>
            <input type="checkbox" value={type} checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} />
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

            <h5>Loan Range (Tier-Specific)</h5>
            <input placeholder="Min" value={tier.loanRange.min} onChange={(e) => handleLoanRangeChange(i, "min", e.target.value)} />
            <input placeholder="Max" value={tier.loanRange.max} onChange={(e) => handleLoanRangeChange(i, "max", e.target.value)} />

            {["light", "medium", "heavy"].map(level => (
              <div key={level}>
                <h6>{level.charAt(0).toUpperCase() + level.slice(1)} Rehab</h6>
                <input placeholder="Max LTP" value={tier.rehabTypeAdjustments[level].maxLTP} onChange={(e) => handleNestedChange(i, level, "maxLTP", e.target.value)} />
                <input placeholder="Total LTC" value={tier.rehabTypeAdjustments[level].totalLTC} onChange={(e) => handleNestedChange(i, level, "totalLTC", e.target.value)} />
                <input placeholder="Max ARV" value={tier.rehabTypeAdjustments[level].maxARV} onChange={(e) => handleNestedChange(i, level, "maxARV", e.target.value)} />
              </div>
            ))}
          </div>
        ))}

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

export default AddFixAndFlip;
