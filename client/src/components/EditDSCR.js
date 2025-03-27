import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditDSCR() {
  const { lenderId, programId } = useParams();
  const navigate = useNavigate();

  const [lender, setLender] = useState(null);
  const [program, setProgram] = useState(null);
  const [numTiers, setNumTiers] = useState(1);
  const [tiers, setTiers] = useState([]);
  const [loanRange, setLoanRange] = useState({ min: "", max: "" });
  const [prepaymentPeriod, setPrepaymentPeriod] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyUse, setPropertyUse] = useState("");

  const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];
  const PROPERTY_USES = ["Standard Rental", "Short Term Rental", "Vacant"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lenderRes, programRes] = await Promise.all([
          fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`),
          fetch(`https://broker-cheetah-backend.onrender.com/api/dscr/dscr-programs/${programId}`),
        ]);

        const lenderData = await lenderRes.json();
        const programData = await programRes.json();

        setLender(lenderData);
        setProgram(programData);
        setTiers(programData.tiers || []);
        setNumTiers(programData.tiers?.length || 1);
        setLoanRange(programData.loanRange || { min: "", max: "" });
        setPrepaymentPeriod(programData.prepaymentPeriod || "");
        setPropertyTypes(programData.propertyTypes || []);
        setPropertyUse(programData.propertyUse || "");
      } catch (error) {
        console.error("❌ Error loading data:", error);
      }
    };

    fetchData();
  }, [lenderId, programId]);

  const handleNumTiersChange = (e) => {
    const newCount = parseInt(e.target.value);
    setNumTiers(newCount);
    setTiers((prev) => {
      const newTiers = [...prev];
      while (newTiers.length < newCount) {
        newTiers.push({ minFICO: "", minExperience: "", maxLTVPurchase: "", maxLTVRateTerm: "", maxLTVCashOut: "", dscrRatioMin: "" });
      }
      return newTiers.slice(0, newCount);
    });
  };

  const handleTierChange = (index, field, value) => {
    setTiers((prevTiers) => {
      const updated = [...prevTiers];
      updated[index][field] = value;
      return updated;
    });
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSave = async () => {
    const formattedLoanRange = {
      min: loanRange.min ? parseInt(loanRange.min) : undefined,
      max: loanRange.max ? parseInt(loanRange.max) : undefined,
    };

    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/dscr/dscr-programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loanRange: formattedLoanRange,
          propertyTypes,
          propertyUse: propertyUse || undefined,
          prepaymentPeriod,
          tiers,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ DSCR Program updated.");
        navigate(`/manage-loan-programs/${lenderId}`);
      } else {
        alert(`❌ Update failed: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Save error:", error);
      alert("❌ Server error.");
    }
  };

  if (!program || !lender) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Edit DSCR Program for {lender.name}</h2>

      <label>Number of Tiers:</label>
      <select value={numTiers} onChange={handleNumTiersChange} style={{ width: "100%", marginBottom: "10px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {tiers.map((tier, index) => (
        <div key={index} style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "10px" }}>
          <h3>Tier {index + 1}</h3>
          <label>Min FICO: <input value={tier.minFICO || ""} onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} /></label><br />
          <label>Min Experience: <input value={tier.minExperience || ""} onChange={(e) => handleTierChange(index, "minExperience", e.target.value)} /></label><br />
          <label>Max LTV (Purchase): <input value={tier.maxLTVPurchase || ""} onChange={(e) => handleTierChange(index, "maxLTVPurchase", e.target.value)} /></label><br />
          <label>Max LTV (Rate & Term): <input value={tier.maxLTVRateTerm || ""} onChange={(e) => handleTierChange(index, "maxLTVRateTerm", e.target.value)} /></label><br />
          <label>Max LTV (Cash-Out): <input value={tier.maxLTVCashOut || ""} onChange={(e) => handleTierChange(index, "maxLTVCashOut", e.target.value)} /></label><br />
          <label>DSCR Ratio Min: <input value={tier.dscrRatioMin || ""} onChange={(e) => handleTierChange(index, "dscrRatioMin", e.target.value)} /></label>
        </div>
      ))}

      <label>Loan Range:</label><br />
      <input placeholder="Min" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} />
      <input placeholder="Max" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} /><br />

      <label>Prepayment Period:</label><br />
      <input value={prepaymentPeriod} onChange={(e) => setPrepaymentPeriod(e.target.value)} /><br />

      <label>Property Types:</label><br />
      {PROPERTY_TYPES.map((type) => (
        <label key={type}><input type="checkbox" checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} /> {type}</label>
      ))}

      <label>Property Use:</label><br />
      {PROPERTY_USES.map((use) => (
        <label key={use}><input type="radio" name="propertyUse" value={use} checked={propertyUse === use} onChange={() => setPropertyUse(use)} /> {use}</label>
      ))}

      <label>Current Rent ($):</label>
      <input
        type="number"
        value={program.dscrInputs?.currentRent || ""}
        onChange={(e) => setProgram({ ...program, dscrInputs: { ...program.dscrInputs, currentRent: e.target.value } })}
      />
      <label>Market Rent ($):</label>
      <input
        type="number"
        value={program.dscrInputs?.marketRent || ""}
        onChange={(e) => setProgram({ ...program, dscrInputs: { ...program.dscrInputs, marketRent: e.target.value } })}
      />
      <label>Taxes ($/year):</label>
      <input
        type="number"
        value={program.dscrInputs?.taxes || ""}
        onChange={(e) => setProgram({ ...program, dscrInputs: { ...program.dscrInputs, taxes: e.target.value } })}
      />
      <label>Insurance ($/year):</label>
      <input
        type="number"
        value={program.dscrInputs?.insurance || ""}
        onChange={(e) => setProgram({ ...program, dscrInputs: { ...program.dscrInputs, insurance: e.target.value } })}
      />
      <label>HOA Fees ($/month):</label>
      <input
        type="number"
        value={program.dscrInputs?.hoaFees || ""}
        onChange={(e) => setProgram({ ...program, dscrInputs: { ...program.dscrInputs, hoaFees: e.target.value } })}
      />

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={handleSave} style={{ marginRight: "10px" }}>💾 Save Program</button>
        <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)}>Cancel</button>
      </div>
    </div>
  );
}

export default EditDSCR;