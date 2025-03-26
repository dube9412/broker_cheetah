import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddFixAndFlip() {
  const { lenderId } = useParams();
  const navigate = useNavigate();

  const [experienceWindowMonths, setExperienceWindowMonths] = useState("");
  const [minAsIsValue, setMinAsIsValue] = useState("");
  const [termLengthMonths, setTermLengthMonths] = useState("");
  const [recourse, setRecourse] = useState({ recourse: false, nonRecourse: false });
  const [interestType, setInterestType] = useState({ dutch: false, nonDutch: false });
  const [drawType, setDrawType] = useState({ self: false, thirdParty: false });
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [tiers, setTiers] = useState([{
    tierName: "",
    minFICO: "",
    minExperience: "",
    loanRange: { min: "", max: "" },
    maxLTC: "",
    totalLTC: "",
    maxARV: "",
    rehabPercent: "",
  }]);

  const PROPERTY_OPTIONS = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];

  const handleCheckboxChange = (type, field) => {
    if (field === "drawType") {
      setDrawType((prev) => ({ ...prev, [type]: !prev[type] }));
    } else if (field === "interestType") {
      setInterestType((prev) => ({ ...prev, [type]: !prev[type] }));
    } else if (field === "recourse") {
      setRecourse((prev) => ({ ...prev, [type]: !prev[type] }));
    }
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    setTiers(newTiers);
  };

  const handleLoanRangeChange = (index, bound, value) => {
    const newTiers = [...tiers];
    newTiers[index].loanRange[bound] = value;
    setTiers(newTiers);
  };

  const handleAddTier = () => {
    setTiers([...tiers, {
      tierName: "",
      minFICO: "",
      minExperience: "",
      loanRange: { min: "", max: "" },
      maxLTC: "",
      totalLTC: "",
      maxARV: "",
      rehabPercent: "",
    }]);
  };

  const handleSubmit = async () => {
    const payload = {
      experienceWindowMonths,
      minAsIsValue,
      termLengthMonths,
      recourse,
      interestType,
      drawType,
      crossCollateralAllowed,
      propertyTypes,
      tiers,
    };

    try {
      const res = await fetch(`https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Program added!");
        navigate(`/manage-loan-programs/${lenderId}`);
      } else {
        alert("❌ Error adding program.");
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("❌ Server error.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Add Fix & Flip Loan Program</h2>

      <fieldset style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <legend><strong>Program Details</strong></legend>

        <label>Experience Window (Months):
          <input value={experienceWindowMonths} onChange={(e) => setExperienceWindowMonths(e.target.value)} />
        </label><br />

        <label>Min As-Is Value:
          <input value={minAsIsValue} onChange={(e) => setMinAsIsValue(e.target.value)} />
        </label><br />

        <label>Term Length (Months):
          <input value={termLengthMonths} onChange={(e) => setTermLengthMonths(e.target.value)} />
        </label><br />

        <label>Recourse:</label>
        <input type="checkbox" checked={recourse.recourse} onChange={() => handleCheckboxChange("recourse", "recourse")} /> Recourse
        <input type="checkbox" checked={recourse.nonRecourse} onChange={() => handleCheckboxChange("nonRecourse", "recourse")} /> Non-Recourse<br />

        <label>Interest Type:</label>
        <input type="checkbox" checked={interestType.dutch} onChange={() => handleCheckboxChange("dutch", "interestType")} /> Dutch
        <input type="checkbox" checked={interestType.nonDutch} onChange={() => handleCheckboxChange("nonDutch", "interestType")} /> Non-Dutch<br />

        <label>Draw Type:</label>
        <input type="checkbox" checked={drawType.self} onChange={() => handleCheckboxChange("self", "drawType")} /> Self
        <input type="checkbox" checked={drawType.thirdParty} onChange={() => handleCheckboxChange("thirdParty", "drawType")} /> 3rd Party<br />

        <label>Cross Collateral Allowed:</label>
        <select value={crossCollateralAllowed} onChange={(e) => setCrossCollateralAllowed(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select><br />

        <label>Property Types:</label><br />
        {PROPERTY_OPTIONS.map((type) => (
          <label key={type} style={{ marginRight: "10px" }}>
            <input type="checkbox" checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} /> {type}<br /></label>
        ))}
      </fieldset>

      <fieldset style={{ padding: "15px", marginBottom: "20px" }}>
        <legend><strong>Tiers</strong></legend>
        {tiers.map((tier, index) => (
          <div key={index} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px" }}>
            <label>Tier Name:
              <input value={tier.tierName} onChange={(e) => handleTierChange(index, "tierName", e.target.value)} />
            </label><br />
            <label>Min FICO:
              <input value={tier.minFICO} onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} />
            </label><br />
            <label>Min Experience:
              <input value={tier.minExperience} onChange={(e) => handleTierChange(index, "minExperience", e.target.value)} />
            </label><br />
            <label>Loan Range:
              Min: <input value={tier.loanRange.min} onChange={(e) => handleLoanRangeChange(index, "min", e.target.value)} />
              Max: <input value={tier.loanRange.max} onChange={(e) => handleLoanRangeChange(index, "max", e.target.value)} />
            </label><br />
            <label>Max LTC:
              <input value={tier.maxLTC} onChange={(e) => handleTierChange(index, "maxLTC", e.target.value)} />
            </label><br />
            <label>Total LTC:
              <input value={tier.totalLTC} onChange={(e) => handleTierChange(index, "totalLTC", e.target.value)} />
            </label><br />
            <label>Max ARV:
              <input value={tier.maxARV} onChange={(e) => handleTierChange(index, "maxARV", e.target.value)} />
            </label><br />
            <label>Rehab %:
              <input value={tier.rehabPercent} onChange={(e) => handleTierChange(index, "rehabPercent", e.target.value)} />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddTier}>+ Add Tier</button>
      </fieldset>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={handleSubmit} style={{ marginRight: "10px" }}>Save Program</button>
          <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} type="button">Cancel</button>
        </div>
    </div>
  );
}

export default AddFixAndFlip;