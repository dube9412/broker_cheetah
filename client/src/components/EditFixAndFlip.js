import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditFixAndFlip() {
    const { lenderId, programId } = useParams();
    const navigate = useNavigate();

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tiers, setTiers] = useState([]);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                console.log(`🔹 Fetching loan program ${programId}`);
                const response = await fetch(`http://localhost:5000/api/loan-programs/${programId}`);
                const data = await response.json();
    
                console.log("🔹 API Response:", data); // Debugging line
    
                if (response.ok && data) {
                    console.log("✅ Loan program loaded:", data);
                    setProgram({
                        name: data.name ?? "",
                        type: data.type ?? "",
                        lender: data.lender ?? lenderId,
                    });

                    setTiers(data.tiers ?? []); // ✅ Load tiers into state
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
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProgram((prev) => ({
            ...prev,
            [name]: value,  // Update the field dynamically
        }));
    };

    const handleSave = async () => {
        try {
            console.log(`🔹 Saving loan program ${programId}`);
            const response = await fetch(`http://localhost:5000/api/loan-programs/${programId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...program,
                    tiers, // ✅ Ensure tiers are included in the update
                }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log("✅ Loan program updated:", result);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!program) return <p>No loan program found.</p>;

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>Editing Loan Program for {program.name}</h2>

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

                    <label>Maximum LTP:</label>
                    <input 
                        type="number" 
                        value={tier.maxLTP} 
                        onChange={(e) => handleTierChange(index, "maxLTP", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />

                    <label>Total LTC:</label>
                    <input 
                        type="number" 
                        value={tier.totalLTC} 
                        onChange={(e) => handleTierChange(index, "totalLTC", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />

                    <label>Maximum ARV:</label>
                    <input 
                        type="number" 
                        value={tier.maxARV} 
                        onChange={(e) => handleTierChange(index, "maxARV", e.target.value)} 
                        style={{ width: "100%", marginBottom: "10px" }} 
                    />
                </div>
            ))}

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={handleSave} style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>Save Changes</button>
                <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
            </div>
        </div>
    );
}

export default EditFixAndFlip;