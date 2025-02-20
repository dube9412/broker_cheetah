import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditDSCR() {
    const { lenderId, programId } = useParams();
    const navigate = useNavigate();

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tiers, setTiers] = useState([]);
    const [loanRange, setLoanRange] = useState({ min: "", max: "" });
    const [prepaymentPeriod, setPrepaymentPeriod] = useState("");
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [propertyUse, setPropertyUse] = useState("");

    // ✅ Options for Property Type & Use
    const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];
    const PROPERTY_USES = ["Standard Rental", "Short Term Rental", "Vacant"];

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                console.log(`🔹 Fetching DSCR loan program ${programId}`);
                const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/dscr/dscr-programs/${programId}`);
                const data = await response.json();

                if (response.ok && data) {
                    console.log("✅ DSCR Loan Program Loaded:", data);
                    setProgram(data);
                    setTiers(data.tiers || []);
                    setLoanRange(data.loanRange || { min: "", max: "" });
                    setPrepaymentPeriod(data.prepaymentPeriod || "");
                    setPropertyTypes(data.propertyTypes || []);
                    setPropertyUse(data.propertyUse || "");
                } else {
                    console.error("❌ Error fetching loan program:", data);
                    setError("Loan program not found.");
                }
            } catch (err) {
                console.error("❌ Error fetching loan program:", err);
                setError("Error loading loan program.");
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [programId, lenderId]);

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

    const handleSave = async () => {
        try {
            console.log(`🔹 Saving DSCR loan program ${programId}`);
            const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/dscr/dscr-programs/${programId}`, { 
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...program,
                    tiers,
                    loanRange,
                    prepaymentPeriod,
                    propertyTypes,
                    propertyUse,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log("✅ DSCR Loan Program Updated:", result);
                alert("Loan program updated successfully!");
                navigate(`/manage-loan-programs/${lenderId}`);
            } else {
                console.error("❌ Error updating loan program:", result);
                alert("Failed to update loan program.");
            }
        } catch (error) {
            console.error("❌ Error updating loan program:", error);
            alert("An error occurred while updating.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this loan program?")) return;
    
        try {
            console.log(`🔹 Deleting loan program: ${programId}`);
    
            const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/dscr/${lenderId}/dscr-programs/${programId}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                console.log("✅ Loan program deleted.");
                alert("Loan program deleted successfully.");
                navigate(`/manage-loan-programs/${lenderId}`);
            } else {
                const errorData = await response.json().catch(() => ({}));  
                console.error("❌ Error deleting loan program:", errorData.message || response.status);
                alert(`Failed to delete loan program: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("❌ Error deleting loan program:", error);
            alert("An error occurred while deleting the loan program.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!program) return <p>No loan program found.</p>;

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>Editing DSCR Loan Program for {program.name}</h2>

            {/* Render tier inputs dynamically */}
            {tiers.map((tier, index) => (
                <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <h3>Tier {index + 1}</h3>
                    
                    <label>Minimum FICO:</label>
                    <input 
                        type="number" 
                        value={tier.minFICO} 
                        onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />

                    <label>Minimum Experience:</label>
                    <input 
                        type="number" 
                        value={tier.minExperience} 
                        onChange={(e) => handleTierChange(index, "minExperience", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />

                    <label>Max LTV (Purchase):</label>
                    <input 
                        type="number" 
                        value={tier.maxLTVPurchase} 
                        onChange={(e) => handleTierChange(index, "maxLTVPurchase", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />

                    <label>Max LTV (Rate & Term Refinance):</label>
                    <input 
                        type="number" 
                        value={tier.maxLTVRateTerm} 
                        onChange={(e) => handleTierChange(index, "maxLTVRateTerm", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />

                    <label>Max LTV (Cash-Out Refinance):</label>
                    <input 
                        type="number" 
                        value={tier.maxLTVCashOut} 
                        onChange={(e) => handleTierChange(index, "maxLTVCashOut", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />

                    <label>DSCR Ratio Min:</label>
                    <input 
                        type="number" 
                        value={tier.dscrRatioMin} 
                        onChange={(e) => handleTierChange(index, "dscrRatioMin", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />
                </div>
            ))}

            <label>Loan Range:</label>
            <input type="text" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} placeholder="Min" style={{ width: "48%", marginRight: "4%" }} />
            <input type="text" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} placeholder="Max" style={{ width: "48%" }} />

            <label>Prepayment Period (PPP):</label>
            <input type="text" value={prepaymentPeriod} onChange={(e) => setPrepaymentPeriod(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Property Types:</label>
            {PROPERTY_TYPES.map((type) => (
                <label key={type}>
                    <input type="checkbox" checked={propertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} />
                    {type}
                </label>
            ))}

            <label>Property Use:</label>
            {PROPERTY_USES.map((use) => (
                <label key={use}>
                    <input type="radio" name="propertyUse" value={use} checked={propertyUse === use} onChange={() => setPropertyUse(use)} />
                    {use}
                </label>
            ))}

<button onClick={handleSave} style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>Save Changes</button>
            <button onClick={handleDelete} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>   Delete Loan Program </button>{" | "}
            <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
            
            </div>
    );
}

export default EditDSCR;
