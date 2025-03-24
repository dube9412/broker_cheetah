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
  const [interestType, setInterestType] = useState("");
  const [drawType, setDrawType] = useState("");
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState("");
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
          setInterestType(data.interestType || "");
          setDrawType(data.drawType || "");
          setCrossCollateralAllowed(data.crossCollateralAllowed || "");
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

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleRecourseChange = (type) => {
    setRecourse((prev) => ({ ...prev, [type]: !prev[type] }));
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
        crossCollateralAllowed,
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
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h2>Editing Fix & Flip: {program.name}</h2>

      <label>Experience Window (Months):</label>
      <input type="number" value={experienceWindowMonths} onChange={(e) => setExperienceWindowMonths(e.target.value)} />

      <label>Min As-Is Property Value:</label>
      <input type="number" value={minAsIsValue} onChange={(e) => setMinAsIsValue(e.target.value)} />

      <label>Term Length (Months):</label>
      <input type="number" value={termLengthMonths} onChange={(e) => setTermLengthMonths(e.target.value)} />

      <label>Recourse:</label>
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
      {PROPERTY_TYPES.map(type => (
        <label key={type}>
          <input type="checkbox" checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} />
          {type}
        </label>
      ))}

      <label>Number of Tiers:</label>
      <select value={numTiers} onChange={handleNumTiersChange}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {tiers.map((tier, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>Tier {i + 1}</h3>
          <input placeholder="Tier Name" value={tier.tierName || ""} onChange={(e) => handleTierChange(i, "tierName", e.target.value)} />
          <input placeholder="Min FICO" value={tier.minFICO || ""} onChange={(e) => handleTierChange(i, "minFICO", e.target.value)} />
          <input placeholder="Min Experience" value={tier.minExperience || ""} onChange={(e) => handleTierChange(i, "minExperience", e.target.value)} />

          <input placeholder="Loan Range Min" value={tier.loanRange?.min || ""} onChange={(e) => handleLoanRangeChange(i, "min", e.target.value)} />
          <input placeholder="Loan Range Max" value={tier.loanRange?.max || ""} onChange={(e) => handleLoanRangeChange(i, "max", e.target.value)} />

          <input placeholder="Max LTC" value={tier.maxLTC || ""} onChange={(e) => handleTierChange(i, "maxLTC", e.target.value)} />
          <input placeholder="Total LTC" value={tier.totalLTC || ""} onChange={(e) => handleTierChange(i, "totalLTC", e.target.value)} />
          <input placeholder="Max ARV" value={tier.maxARV || ""} onChange={(e) => handleTierChange(i, "maxARV", e.target.value)} />
          <input placeholder="Rehab % Covered" value={tier.rehabPercent || ""} onChange={(e) => handleTierChange(i, "rehabPercent", e.target.value)} />
        </div>
      ))}

      <br />
      <button onClick={handleSave}>💾 Save</button>
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>❌ Delete</button>
      <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} style={{ marginLeft: "10px" }}>Cancel</button>
    </div>
  );
}

export default EditFixAndFlip;
