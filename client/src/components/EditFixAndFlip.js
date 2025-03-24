import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditFixAndFlip() {
  const { lenderId, programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [numTiers, setNumTiers] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loanRange, setLoanRange] = useState({ min: "", max: "" });
  const [experienceWindowMonths, setExperienceWindowMonths] = useState("");
  const [minAsIsValue, setMinAsIsValue] = useState("");
  const [rehabTypeDefinition, setRehabTypeDefinition] = useState({ method: "", threshold: "" });
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
          setLoanRange(data.loanRange || { min: "", max: "" });
          setExperienceWindowMonths(data.experienceWindowMonths || "");
          setMinAsIsValue(data.minAsIsValue || "");
          setRehabTypeDefinition(data.rehabTypeDefinition || { method: "", threshold: "" });
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

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...tiers];
    updated[index][field] = value;
    setTiers(updated);
  };

  const handleRehabAdjustmentChange = (index, rehabType, field, value) => {
    const updated = [...tiers];
    if (!updated[index].rehabTypeAdjustments) updated[index].rehabTypeAdjustments = {};
    if (!updated[index].rehabTypeAdjustments[rehabType]) updated[index].rehabTypeAdjustments[rehabType] = {};
    updated[index].rehabTypeAdjustments[rehabType][field] = value;
    setTiers(updated);
  };

  const handleTierLoanRangeChange = (index, bound, value) => {
    const updated = [...tiers];
    if (!updated[index].loanRange) updated[index].loanRange = {};
    updated[index].loanRange[bound] = value;
    setTiers(updated);
  };

  const handleNumTiersChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumTiers(count);
    setTiers((prev) => {
      const newTiers = [...prev];
      while (newTiers.length < count) {
        newTiers.push({});
      }
      return newTiers.slice(0, count);
    });
  };

  const handleSave = async () => {
    try {
      const updatedProgram = {
        ...program,
        tiers,
        loanRange,
        propertyTypes,
        experienceWindowMonths,
        minAsIsValue,
        rehabTypeDefinition,
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

      <label>Experience Window (months):</label>
      <input type="number" value={experienceWindowMonths} onChange={(e) => setExperienceWindowMonths(e.target.value)} />

      <label>Min As-Is Value:</label>
      <input type="number" value={minAsIsValue} onChange={(e) => setMinAsIsValue(e.target.value)} />

      <label>Loan Range:</label>
      <input placeholder="Min" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} />
      <input placeholder="Max" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} />

      <label>Rehab Definition:</label>
      <select value={rehabTypeDefinition.method} onChange={(e) => setRehabTypeDefinition({ ...rehabTypeDefinition, method: e.target.value })}>
        <option value="">-- Select Method --</option>
        <option value="percentage">By % of Purchase Price</option>
        <option value="sowChecklist">Scope of Work</option>
      </select>
      {rehabTypeDefinition.method === "percentage" && (
        <>
          <label>Threshold %:</label>
          <input type="number" value={rehabTypeDefinition.threshold} onChange={(e) => setRehabTypeDefinition({ ...rehabTypeDefinition, threshold: e.target.value })} />
        </>
      )}

      <label>Number of Tiers:</label>
      <select value={numTiers} onChange={handleNumTiersChange}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {tiers.map((tier, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>Tier {i + 1}</h3>
          <label>Tier Name:</label>
          <input type="text" value={tier.tierName || ""} onChange={(e) => handleTierChange(i, "tierName", e.target.value)} />

          <label>Min FICO:</label>
          <input type="number" value={tier.minFICO || ""} onChange={(e) => handleTierChange(i, "minFICO", e.target.value)} />

          <label>Min Experience:</label>
          <input type="number" value={tier.minExperience || ""} onChange={(e) => handleTierChange(i, "minExperience", e.target.value)} />

          <label>Loan Range:</label>
          <input placeholder="Min" value={tier.loanRange?.min || ""} onChange={(e) => handleTierLoanRangeChange(i, "min", e.target.value)} />
          <input placeholder="Max" value={tier.loanRange?.max || ""} onChange={(e) => handleTierLoanRangeChange(i, "max", e.target.value)} />

          <label>Max ARV:</label>
          <input type="number" value={tier.maxARV || ""} onChange={(e) => handleTierChange(i, "maxARV", e.target.value)} />

          <label>Max Rehab:</label>
          <input type="number" value={tier.maxRehab || ""} onChange={(e) => handleTierChange(i, "maxRehab", e.target.value)} />

          <h4>Rehab Type Adjustments</h4>
          {["light", "medium", "heavy"].map(type => (
            <div key={type}>
              <strong>{type.toUpperCase()}:</strong>
              <input placeholder="maxLTP" value={tier.rehabTypeAdjustments?.[type]?.maxLTP || ""} onChange={(e) => handleRehabAdjustmentChange(i, type, "maxLTP", e.target.value)} />
              <input placeholder="totalLTC" value={tier.rehabTypeAdjustments?.[type]?.totalLTC || ""} onChange={(e) => handleRehabAdjustmentChange(i, type, "totalLTC", e.target.value)} />
              <input placeholder="maxARV" value={tier.rehabTypeAdjustments?.[type]?.maxARV || ""} onChange={(e) => handleRehabAdjustmentChange(i, type, "maxARV", e.target.value)} />
            </div>
          ))}
        </div>
      ))}

      <label>Property Types:</label>
      <div>
        {PROPERTY_TYPES.map((type) => (
          <label key={type}>
            <input type="checkbox" checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} />
            {type}
          </label>
        ))}
      </div>

      <br />
      <button onClick={handleSave}>💾 Save</button>
      <button onClick={handleDelete}>❌ Delete</button>
      <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} type="button">
        Cancel
      </button>
    </div>
  );
}

export default EditFixAndFlip;
