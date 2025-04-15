import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddFixAndFlip() {
  const { lenderId } = useParams();
  const navigate = useNavigate();

  const [experienceWindowMonths, setExperienceWindowMonths] = useState("");
  const [minAsIsValue, setMinAsIsValue] = useState("");
  const [termLengthMonths, setTermLengthMonths] = useState([]); // Update to array for checkboxes
  const [recourse, setRecourse] = useState({ recourse: false, nonRecourse: false });
  const [interestType, setInterestType] = useState({ dutch: false, nonDutch: false });
  const [drawType, setDrawType] = useState({ self: false, thirdParty: false });
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState(null);
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
    maxRehabBudget: "", // Add maxRehabBudget field
  }]);
  const [highlightNote, setHighlightNote] = useState(""); // Add highlightNote state
  const [setting, setSetting] = useState("Non-Rural"); // Renamed from 'rural' to 'setting'
  const [formData, setFormData] = useState({ averageTimeToClose: "" }); // Add formData state

  const PROPERTY_OPTIONS = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];
  const TERM_LENGTH_OPTIONS = [12, 13, 18, 19, 24]; // Updated term length options

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
      maxRehabBudget: "", // Add maxRehabBudget field
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
      crossCollateralAllowed: !!crossCollateralAllowed,
      propertyTypes,
      tiers,
      highlightNote, // Include highlightNote in the payload
      setting, // Renamed from 'rural' to 'setting'
      averageTimeToClose: formData.averageTimeToClose, // Include averageTimeToClose in the payload
    };

    console.log("🔍 SUBMIT PAYLOAD", payload);

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

        <label>Term Length (Months):</label>
        <div>
          {TERM_LENGTH_OPTIONS.map((length) => (
            <label key={length} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                value={length}
                checked={termLengthMonths.includes(length)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...termLengthMonths, length]
                    : termLengthMonths.filter((l) => l !== length);
                  setTermLengthMonths(updated);
                }}
              />
              {length} months
            </label>
          ))}
        </div><br />

        <label>Recourse:</label>
        <input type="checkbox" checked={recourse.recourse} onChange={() => handleCheckboxChange("recourse", "recourse")} /> Recourse
        <input type="checkbox" checked={recourse.nonRecourse} onChange={() => handleCheckboxChange("nonRecourse", "recourse")} /> Non-Recourse<br />

        <label>Interest Type:</label>
        <input type="checkbox" checked={interestType.dutch} onChange={() => handleCheckboxChange("dutch", "interestType")} /> Dutch
        <input type="checkbox" checked={interestType.nonDutch} onChange={() => handleCheckboxChange("nonDutch", "interestType")} /> Non-Dutch<br />

        <label>Draw Type:</label>
        <input type="checkbox" checked={drawType.self} onChange={() => handleCheckboxChange("self", "drawType")} /> Self
        <input type="checkbox" checked={drawType.thirdParty} onChange={() => handleCheckboxChange("thirdParty", "drawType")} /> 3rd Party<br />

        <label>Cross Collateral Allowed:</label><br />
        <label>
          <input
            type="radio"
            name="crossCollateral"
            checked={crossCollateralAllowed === true}
            onChange={() => setCrossCollateralAllowed(true)}
          /> Yes
        </label>
        <label>
          <input
            type="radio"
            name="crossCollateral"
            checked={crossCollateralAllowed === false}
            onChange={() => setCrossCollateralAllowed(false)}
          /> No
        </label>
        <br />

        <label>Property Types:</label><br />
        {PROPERTY_OPTIONS.map((type) => (
          <label key={type} style={{ marginRight: "10px" }}>
            <input type="checkbox" checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} /> {type}<br /></label>
        ))}
        <fieldset>
          <legend>Setting</legend>
          <label>
            <input
              type="radio"
              name="setting"
              value="Rural"
              checked={setting === "Rural"}
              onChange={() => setSetting("Rural")}
            />
            Rural
          </label>
          <label>
            <input
              type="radio"
              name="setting"
              value="Non-Rural"
              checked={setting === "Non-Rural"}
              onChange={() => setSetting("Non-Rural")}
            />
            Non-Rural
          </label>
        </fieldset>
        <label>
          Average Time to Close (days):
          <input
            type="number"
            value={formData.averageTimeToClose || ""}
            onChange={(e) => setFormData({ ...formData, averageTimeToClose: e.target.value })}
            min="0"
          />
        </label>
      </fieldset>

      <fieldset style={{ border: "1px solid #aaa", padding: "10px", marginBottom: "15px" }}>
        <legend><strong>Tiers</strong></legend>
        {tiers.map((tier, index) => (
          <div key={index} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px" }}>
            <label>Tier Name:
              <input placeholder="Ex Basic, Gold, Tier 1" value={tier.tierName} onChange={(e) => handleTierChange(index, "tierName", e.target.value)} />
              </label>
              <label>  FICO:
              <input placeholder="min" value={tier.minFICO} onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} />
              </label>
              <label>  Experience:
              <input placeholder="Completed Deals" value={tier.minExperience} onChange={(e) => handleTierChange(index, "minExperience", e.target.value)} />
              </label>
              <label>  Loan Range:
              <input placeholder="min" value={tier.loanRange.min} onChange={(e) => handleLoanRangeChange(index, "min", e.target.value)} />
              <input placeholder="max" value={tier.loanRange.max} onChange={(e) => handleLoanRangeChange(index, "max", e.target.value)} />
              </label>
              <label>  Max LTC:
              <input placeholder="Max Purchase %"value={tier.maxLTC} onChange={(e) => handleTierChange(index, "maxLTC", e.target.value)} />
              </label>
              <label>  Total or Blended LTC:
              <input placeholder="Total or Blended LTC" value={tier.totalLTC} onChange={(e) => handleTierChange(index, "totalLTC", e.target.value)} />
              </label>
              <label>  Max ARV:
              <input placeholder="Max ARV" value={tier.maxARV} onChange={(e) => handleTierChange(index, "maxARV", e.target.value)} />
              </label>
              <label>  Max Rehab %:
              <input placeholder="Max Rehab %" value={tier.rehabPercent} onChange={(e) => handleTierChange(index, "rehabPercent", e.target.value)} />
              </label>
              <label>  Max Rehab Budget:
              <input placeholder="Max Rehab Budget" value={tier.maxRehabBudget} onChange={(e) => handleTierChange(index, "maxRehabBudget", e.target.value)} />
              </label>
          </div>
        ))}
        <button type="button" onClick={handleAddTier}>+ Add Tier</button>
      </fieldset>

      <label>Highlight Note:</label>
      <textarea
        value={highlightNote}
        onChange={(e) => setHighlightNote(e.target.value)}
        placeholder="Enter a note explaining why this program is a good fit"
        style={{ width: "100%", height: "100px", marginBottom: "10px" }}
      />

      <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={handleSubmit} style={{ marginRight: "10px" }}>Save Program</button>
          <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} type="button">Cancel</button>
        </div>
    </div>
  );
}

export default AddFixAndFlip;