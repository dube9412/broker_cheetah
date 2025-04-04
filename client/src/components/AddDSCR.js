import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddDSCR() {
    const { lenderId } = useParams();
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [numTiers, setNumTiers] = useState(1);
    const [tiers, setTiers] = useState([
        {
            tierName: "",
            minFICO: "",
            minExperience: "",
            maxLTVPurchase: "",
            maxLTVRateTerm: "",
            maxLTVCashOut: "",
            dscrRatioMin: "",
        },
    ]);
    const [loanRange, setLoanRange] = useState({ min: "", max: "" });
    const [prepaymentPeriod, setPrepaymentPeriod] = useState("");
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [propertyUse, setPropertyUse] = useState("");
    const [currentRent, setCurrentRent] = useState("");
    const [marketRent, setMarketRent] = useState("");
    const [taxes, setTaxes] = useState("");
    const [insurance, setInsurance] = useState("");
    const [hoaFees, setHoaFees] = useState("");
    const [highlightNote, setHighlightNote] = useState("");
    const [homeValue, setHomeValue] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [loanTermYears, setLoanTermYears] = useState("");

    const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];
    const PROPERTY_USES = ["Standard Rental", "Short Term Rental", "Vacant"];

    useEffect(() => {
        const fetchLender = async () => {
            try {
                const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`);
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
                    newTiers.push({
                        tierName: "",
                        minFICO: "",
                        minExperience: "",
                        maxLTVPurchase: "",
                        maxLTVRateTerm: "",
                        maxLTVCashOut: "",
                        dscrRatioMin: "",
                    });
                }
            } else {
                newTiers.length = newNumTiers;
            }

            return newTiers;
        });
    };

    const handleTierChange = (index, field, value) => {
        const updatedTiers = [...tiers];
        updatedTiers[index][field] = value;
        setTiers(updatedTiers);
    };

    const handleAddTier = () => {
        setTiers([
            ...tiers,
            {
                tierName: "",
                minFICO: "",
                minExperience: "",
                maxLTVPurchase: "",
                maxLTVRateTerm: "",
                maxLTVCashOut: "",
                dscrRatioMin: "",
            },
        ]);
    };

    const handlePropertyTypeChange = (type) => {
        setPropertyTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedLoanRange = {
            min: loanRange.min ? Number(loanRange.min) : undefined,
            max: loanRange.max ? Number(loanRange.max) : undefined,
        };

        const cleanedTiers = tiers.map((tier) => ({
            ...tier,
            minFICO: tier.minFICO ? Number(tier.minFICO) : undefined,
            minExperience: tier.minExperience ? Number(tier.minExperience) : undefined,
            maxLTVPurchase: tier.maxLTVPurchase ? Number(tier.maxLTVPurchase) : undefined,
            maxLTVRateTerm: tier.maxLTVRateTerm ? Number(tier.maxLTVRateTerm) : undefined,
            maxLTVCashOut: tier.maxLTVCashOut ? Number(tier.maxLTVCashOut) : undefined,
            dscrRatioMin: tier.dscrRatioMin ? Number(tier.dscrRatioMin) : undefined,
        }));

        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/dscr/${lenderId}/dscr-programs`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "New DSCR Program",
                        type: "DSCR",
                        lender: lenderId,
                        loanRange: formattedLoanRange,
                        propertyTypes,
                        propertyUse: propertyUse || undefined,
                        prepaymentPeriod: prepaymentPeriod || undefined,
                        tiers: cleanedTiers,
                        dscrInputs: {
                            currentRent: currentRent ? Number(currentRent) : undefined,
                            marketRent: marketRent ? Number(marketRent) : undefined,
                            taxes: taxes ? Number(taxes) : undefined,
                            insurance: insurance ? Number(insurance) : undefined,
                            hoaFees: hoaFees ? Number(hoaFees) : undefined,
                        },
                        highlightNote,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                console.log("✅ DSCR Loan Program Saved:", data);
                alert("Program added successfully!");
                navigate(`/manage-loan-programs/${lenderId}`);
            } else {
                console.error("❌ Failed to add program:", data);
                alert(`Failed to add program: ${data.message}`);
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
                <label>Loan Range:</label>
                <input type="number" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} placeholder="Min" style={{ width: "48%", marginRight: "4%" }} />
                <input type="number" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} placeholder="Max" style={{ width: "48%" }} />

                <label>Prepayment Period (PPP):</label>
                <input type="number" value={prepaymentPeriod} onChange={(e) => setPrepaymentPeriod(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <label>Property Types:</label>
                <div>
                    {PROPERTY_TYPES.map((type) => (
                        <label key={type}>
                            <input
                                type="checkbox"
                                value={type}
                                checked={propertyTypes.includes(type)}
                                onChange={() => handlePropertyTypeChange(type)}
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

                <label>Current Rent ($):</label>
                <input type="number" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <label>Market Rent ($):</label>
                <input type="number" value={marketRent} onChange={(e) => setMarketRent(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <label>Taxes ($/year):</label>
                <input type="number" value={taxes} onChange={(e) => setTaxes(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <label>Insurance ($/year):</label>
                <input type="number" value={insurance} onChange={(e) => setInsurance(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <label>HOA Fees ($/month):</label>
                <input type="number" value={hoaFees} onChange={(e) => setHoaFees(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <fieldset>
                    <legend>Tiers</legend>
                    {tiers.map((tier, index) => (
                        <div key={index}>
                            <label>Tier Name: <input value={tier.tierName} onChange={(e) => handleTierChange(index, "tierName", e.target.value)} /></label>
                            <label>Min FICO: <input value={tier.minFICO} onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} /></label>
                            <label>Min Experience: <input value={tier.minExperience} onChange={(e) => handleTierChange(index, "minExperience", e.target.value)} /></label>
                            <label>Max LTV Purchase: <input value={tier.maxLTVPurchase} onChange={(e) => handleTierChange(index, "maxLTVPurchase", e.target.value)} /></label>
                            <label>Max LTV Rate Term: <input value={tier.maxLTVRateTerm} onChange={(e) => handleTierChange(index, "maxLTVRateTerm", e.target.value)} /></label>
                            <label>Max LTV Cash-Out: <input value={tier.maxLTVCashOut} onChange={(e) => handleTierChange(index, "maxLTVCashOut", e.target.value)} /></label>
                            <label>DSCR Ratio Min: <input value={tier.dscrRatioMin} onChange={(e) => handleTierChange(index, "dscrRatioMin", e.target.value)} /></label>
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

                <label>Home Value ($):</label>
                <input type="number" value={homeValue} onChange={(e) => setHomeValue(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <label>Purchase Price ($):</label>
                <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                <label>Loan Term (Years):</label>
                <select value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
                    <option value="">-- Select --</option>
                    {[15, 20, 25, 30, 40].map((term) => (
                        <option key={term} value={term}>{term} years</option>
                    ))}
                </select>

                <button style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px' }}>
                    Add DSCR Loan Program
                </button>
                <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} type="button" style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default AddDSCR;
