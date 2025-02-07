import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddFixAndFlip() {
    const { lenderId } = useParams();
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [numTiers, setNumTiers] = useState(1); // Default to 1 tier
    const [tiers, setTiers] = useState([{ minFICO: "", minExperience: "", maxLTP: "", totalLTC: "", maxARV: "" }]);

    useEffect(() => {
        const fetchLender = async () => {
            try {
                const response = await fetch(`/api/lenders/${lenderId}`);
                const data = await response.json();
                setLender(data);
            } catch (error) {
                console.error("Error fetching lender details:", error);
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
                    newTiers.push({ minFICO: "", minExperience: "", maxLTP: "", totalLTC: "", maxARV: "" });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/loan-programs/${lenderId}/fix-and-flip-programs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Fix and Flip", // ✅ Fix: Adding the required 'name' field
                    type: "Fix and Flip", // ✅ No need for "programName"
                    lender: lenderId, 
                    tiers // ✅ Sending the entire tiers array
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                console.log("✅ Loan program saved successfully:", data);
                alert("Program added successfully!");
                navigate(`/manage-loan-programs/${lenderId}`);
            } else {
                console.error("❌ Failed to add program:", data);
                alert("Failed to add program.");
            }
        } catch (error) {
            console.error("Error adding program:", error);
            alert("An error occurred while adding the program.");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>
                {lender ? `Adding Fix & Flip Loan Program for ${lender.name}` : "Loading Lender..."}
            </h2>

            <form onSubmit={handleSubmit}>
                {/* ✅ Removed Program Name Field */}

                <label>Number of Tiers:</label>
                <select value={numTiers} onChange={handleNumTiersChange} style={{ width: "100%", marginBottom: "10px" }}>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                {/* ✅ Render tier inputs dynamically */}
                {tiers.map((tier, index) => (
                    <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <h3>Tier {index + 1}</h3>
                        <label>Minimum FICO:</label>
                        <input type="number" value={tier.minFICO} onChange={(e) => handleTierChange(index, "minFICO", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>Minimum Experience:</label>
                        <input type="number" value={tier.minExperience} onChange={(e) => handleTierChange(index, "minExperience", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>Maximum LTP:</label>
                        <input type="number" value={tier.maxLTP} onChange={(e) => handleTierChange(index, "maxLTP", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>Total LTC:</label>
                        <input type="number" value={tier.totalLTC} onChange={(e) => handleTierChange(index, "totalLTC", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

                        <label>Maximum ARV:</label>
                        <input type="number" value={tier.maxARV} onChange={(e) => handleTierChange(index, "maxARV", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
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
