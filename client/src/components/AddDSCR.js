import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddDSCR() {
    const { lenderId } = useParams();
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [numTiers, setNumTiers] = useState(1);
    const [tiers, setTiers] = useState([
        { minFICO: "", minExperience: "", maxLTVPurchase: "", maxLTVRateTerm: "", maxLTVCashOut: "", dscrRatioMin: "" }
    ]);

    const [loanRange, setLoanRange] = useState({ min: "", max: "" });
    const [prepaymentPeriod, setPrepaymentPeriod] = useState("");
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [propertyUse, setPropertyUse] = useState("");

    // ✅ Options for Property Type Selection
    const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];
    const PROPERTY_USES = ["Standard Rental", "Short Term Rental", "Vacant"];

    useEffect(() => {
        const fetchLender = async () => {
            try {
                const response = await fetch(`/api/lenders/${lenderId}`);
                const data = await response.json();
                setLender(data);
            } catch (error) {
                console.error("Error fetching lender:", error);
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
                    newTiers.push({ minFICO: "", minExperience: "", maxLTVPurchase: "", maxLTVRateTerm: "", maxLTVCashOut: "", dscrRatioMin: "" });
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
        try {
            console.log("🛠 Submitting DSCR Loan Program:", {
                lender: lenderId,
                type: "DSCR",
                tiers,
                loanRange,
                prepaymentPeriod,
                propertyTypes,  // ✅ Now being sent
                propertyUse,
            });
    
            const response = await fetch(`http://localhost:5000/api/loan-programs/${lenderId}/dscr-programs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lender: lenderId,
                    type: "DSCR",
                    tiers,
                    loanRange,
                    prepaymentPeriod,
                    propertyTypes,  // ✅ Now being sent
                    propertyUse,
                })
            });
    

            const data = await response.json();
            if (response.ok && data.success) {
                console.log("✅ DSCR Loan Program Saved:", data);
                alert("Program added successfully!");
                navigate(`/manage-loan-programs/${lenderId}`);
            } else {
                console.error("❌ Failed to add program:", data);
                alert("Failed to add program.");
            }
        } catch (error) {
            console.error("❌ Error adding program:", error);
            alert("An error occurred while adding the program.");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>
                {lender ? `Adding DSCR Loan Program for ${lender.name}` : "Loading Lender..."}
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

                {/* Render tier inputs dynamically */}
                {tiers.map((tier, index) => (
                    <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <h3>Tier {index + 1}</h3>
                        <label>Minimum FICO:</label>
                        <input type="number" value={tier.minFICO} onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>Minimum Experience:</label>
                        <input type="number" value={tier.minExperience} onChange={(e) => handleTierChange(index, "minExperience", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>Max LTV (Purchase):</label>
                        <input type="number" value={tier.maxLTVPurchase} onChange={(e) => handleTierChange(index, "maxLTVPurchase", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>Max LTV (Rate & Term Refinance):</label>
                        <input type="number" value={tier.maxLTVRateTerm} onChange={(e) => handleTierChange(index, "maxLTVRateTerm", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>Max LTV (Cash-Out Refinance):</label>
                        <input type="number" value={tier.maxLTVCashOut} onChange={(e) => handleTierChange(index, "maxLTVCashOut", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>DSCR Ratio Min:</label>
                        <input type="number" value={tier.dscrRatioMin} onChange={(e) => handleTierChange(index, "dscrRatioMin", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
                    </div>
                ))}

                <label>Loan Range:</label>
                <input type="text" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} placeholder="Min" style={{ width: "48%", marginRight: "4%" }} />
                <input type="text" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} placeholder="Max" style={{ width: "48%" }} />

                <label>Prepayment Period (PPP):</label>
                <input type="text" value={prepaymentPeriod} onChange={(e) => setPrepaymentPeriod(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <label>Property Types:</label>
<div>
    {PROPERTY_TYPES.map((type) => (
        <label key={type} style={{ display: "block" }}>
            <input
                type="checkbox"
                value={type}
                checked={propertyTypes.includes(type)}
                onChange={(e) => {
                    if (e.target.checked) {
                        setPropertyTypes([...propertyTypes, type]); // ✅ Add type
                    } else {
                        setPropertyTypes(propertyTypes.filter((t) => t !== type)); // ✅ Remove type
                    }
                }}
            />
            {type}
        </label>
    ))}
</div>

                <label>Property Use:</label>
                {PROPERTY_USES.map((use) => (
                    <label key={use}>
                        <input type="radio" name="propertyUse" value={use} checked={propertyUse === use} onChange={() => setPropertyUse(use)} />
                        {use}
                    </label>
                ))}

                <button type="submit">Add DSCR Loan Program</button>
            </form>
        </div>
    );
}

export default AddDSCR;
