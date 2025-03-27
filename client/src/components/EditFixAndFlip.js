
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditFixAndFlip() {
  const { lenderId, programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [numTiers, setNumTiers] = useState(1);
  const [loading, setLoading] = useState(true);

  const [experienceWindowMonths, setExperienceWindowMonths] = useState("");
  const [minAsIsValue, setMinAsIsValue] = useState("");
  const [termLengthMonths, setTermLengthMonths] = useState("");
  const [recourse, setRecourse] = useState({ recourse: false, nonRecourse: false });
  const [interestType, setInterestType] = useState({ dutch: false, nonDutch: false });
  const [drawType, setDrawType] = useState({ self: false, thirdParty: false });
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/fix-and-flip/fix-and-flip-programs/${programId}`);
        const data = await response.json();
        if (response.ok) {
          setProgram(data);
          setTiers(data.tiers || []);
          setNumTiers(data.tiers?.length || 1);
          setExperienceWindowMonths(data.experienceWindowMonths || "");
          setMinAsIsValue(data.minAsIsValue || "");
          setTermLengthMonths(data.termLengthMonths || "");
          setRecourse(data.recourse || { recourse: false, nonRecourse: false });
          setInterestType(data.interestType || { dutch: false, nonDutch: false });
          setDrawType(data.drawType || { self: false, thirdParty: false });
          setCrossCollateralAllowed(data.crossCollateralAllowed ?? null);
          setPropertyTypes(data.propertyTypes || []);
        }
      } catch (error) {
        console.error("Error fetching program:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [programId]);

  const handleCheckboxChange = (stateSetter, key) => {
    stateSetter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleNumTiersChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumTiers(count);
    setTiers((prev) => {
      const newTiers = [...prev];
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
      return newTiers.slice(0, count);
    });
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

  const handleSave = async () => {
    try {
      const updatedProgram = {
        ...program,
        experienceWindowMonths,
        minAsIsValue,
        termLengthMonths,
        recourse,
        interestType,
        drawType,
        crossCollateralAllowed: !!crossCollateralAllowed,
        propertyTypes,
        tiers,
      };

      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/fix-and-flip/fix-and-flip-programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProgram),
      });

      if (response.ok) {
        alert("✅ Program updated!");
        navigate(`/manage-loan-programs/${lenderId}`);
      } else {
        const data = await response.json();
        alert("❌ Update failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Error during update:", error);
      alert("❌ Server error while saving.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this loan program?")) return;
    try {
      await fetch(`https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs/${programId}`, {
        method: "DELETE",
      });
      alert("✅ Deleted.");
      navigate(`/manage-loan-programs/${lenderId}`);
    } catch (error) {
      alert("❌ Delete failed.");
    }
  };

  if (loading || !program) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Edit Fix & Flip Program</h2>

      <fieldset style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <legend><strong>Program Details</strong></legend>

        <label>Experience Window (Months):
          <input type="number" value={experienceWindowMonths} onChange={(e) => setExperienceWindowMonths(e.target.value)} />
        </label><br />

        <label>Min As-Is Property Value:
          <input type="number" value={minAsIsValue} onChange={(e) => setMinAsIsValue(e.target.value)} />
        </label><br />

        <label>Term Length (Months):
          <input type="number" value={termLengthMonths} onChange={(e) => setTermLengthMonths(e.target.value)} />
        </label><br />

        <label>Recourse:</label>
        <label><input type="checkbox" checked={recourse.recourse} onChange={() => handleCheckboxChange(setRecourse, "recourse")} /> Recourse</label>
        <label><input type="checkbox" checked={recourse.nonRecourse} onChange={() => handleCheckboxChange(setRecourse, "nonRecourse")} /> Non-Recourse</label><br />

        <label>Interest Type:</label>
        <label><input type="checkbox" checked={interestType.dutch} onChange={() => handleCheckboxChange(setInterestType, "dutch")} /> Dutch</label>
        <label><input type="checkbox" checked={interestType.nonDutch} onChange={() => handleCheckboxChange(setInterestType, "nonDutch")} /> Non-Dutch</label><br />

        <label>Draw Type:</label>
        <label><input type="checkbox" checked={drawType.self} onChange={() => handleCheckboxChange(setDrawType, "self")} /> Self</label>
        <label><input type="checkbox" checked={drawType.thirdParty} onChange={() => handleCheckboxChange(setDrawType, "thirdParty")} /> 3rd Party</label><br />

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
        {PROPERTY_TYPES.map(type => (
          <label key={type} style={{ marginRight: "10px" }}>
            <input type="checkbox" checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} />
            {type}
          </label>
        ))}
      </fieldset>

      <label>Number of Tiers:
        <select value={numTiers} onChange={handleNumTiersChange}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label><br /><br />

      {tiers.map((tier, i) => (
        <fieldset key={i} style={{ border: "1px solid #aaa", padding: "10px", marginBottom: "15px" }}>
          <legend><strong>Tier {i + 1}</strong></legend>
          <label>  Tier Name:<input placeholder="Tier Name" value={tier.tierName || ""} onChange={(e) => handleTierChange(i, "tierName", e.target.value)} /></label>
          <label>  Min Fico:<input placeholder="Min FICO" value={tier.minFICO || ""} onChange={(e) => handleTierChange(i, "minFICO", e.target.value)} /></label>
          <label>  Min Experience:<input placeholder="Completed Deals" value={tier.minExperience || ""} onChange={(e) => handleTierChange(i, "minExperience", e.target.value)} /></label>
          <label>  Loan Range Min:<input placeholder="Min" value={tier.loanRange?.min || ""} onChange={(e) => handleLoanRangeChange(i, "min", e.target.value)} />
          <input placeholder="Max" value={tier.loanRange?.max || ""} onChange={(e) => handleLoanRangeChange(i, "max", e.target.value)} /></label>
          <label>  Max LTC:<input placeholder="Max Purchase %" value={tier.maxLTC || ""} onChange={(e) => handleTierChange(i, "maxLTC", e.target.value)} /></label>
          <label>  Total LTC:<input placeholder="Total or Blended LTC" value={tier.totalLTC || ""} onChange={(e) => handleTierChange(i, "totalLTC", e.target.value)} /></label>
          <label>  Max ARV:<input placeholder="Max ARV" value={tier.maxARV || ""} onChange={(e) => handleTierChange(i, "maxARV", e.target.value)} /></label>
          <label>  Rehab % Covered:<input placeholder="Max Rehab %" value={tier.rehabPercent || ""} onChange={(e) => handleTierChange(i, "rehabPercent", e.target.value)} /></label>

           </fieldset>
      ))}

<div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={handleSave} style={{ marginRight: "10px" }}>💾 Save Program</button>
          <button onClick={handleDelete} style={{ marginRight: "10px" }}>❌ Delete</button>
          <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} type="button">Cancel</button>
        </div>
    
    </div>
  );
}

export default EditFixAndFlip;
