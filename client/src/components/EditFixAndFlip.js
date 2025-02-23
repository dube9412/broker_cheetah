import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditFixAndFlip() {
    const { lenderId, programId } = useParams();
    const navigate = useNavigate();

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tiers, setTiers] = useState([]);
    const [numTiers, setNumTiers] = useState(1);
    const [loanRange, setLoanRange] = useState({ min: "", max: "" });
    const [propertyTypes, setPropertyTypes] = useState([]);

    const PROPERTY_TYPES = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];
   


    useEffect(() => {
        const fetchProgram = async () => {
            try {
                console.log(`🔹 Fetching loan program ${programId}`);
                const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/fix-and-flip/fix-and-flip-programs/${programId}`);
                const data = await response.json();
    
                console.log("🔹 API Response:", data); // Debugging line
    
                if (response.ok && data) {
                    console.log("✅ Loan program loaded:", data);
                    setProgram({
                        name: data.name ?? "",
                        type: data.type ?? "",
                        lender: data.lender ?? lenderId,
                    });
                    setLoanRange({ min: data.loanRange?.min || "", max: data.loanRange?.max || "" });


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

    useEffect(() => {
        if (tiers.length) {
          setNumTiers(tiers.length);
        }
      }, [tiers]);

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
   

const handleNumTiersChange = (e) => {
  const newNumTiers = parseInt(e.target.value, 10);
  setNumTiers(newNumTiers);

  setTiers((prevTiers) => {
    const updatedTiers = [...prevTiers];

    while (updatedTiers.length < newNumTiers) {
      updatedTiers.push({ minFICO: "", minExperience: "", maxLTP: "", totalLTC: "", maxARV: "", maxRehab: "" });
    }

    return updatedTiers.slice(0, newNumTiers);
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
            const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/fix-and-flip/fix-and-flip-programs/${programId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...program,
                    tiers, // ✅ Ensure tiers are included in the update
                    loanRange, 
                    propertyTypes
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

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this loan program?")) return;
    
        try {
            console.log(`🔹 Deleting loan program: ${programId}`);
    
            const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs/${programId}`, {
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
            <h2 style={{ textAlign: "center" }}>Editing Loan Program for {program.name}</h2>

            <label>Number of Tiers:</label>
                <select value={numTiers} onChange={handleNumTiersChange} style={{ width: "100%", marginBottom: "10px" }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
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
                     <label>Maximum Rehab $:</label>
                        <input type="number" value={tier.maxRehab} onChange={(e) => handleTierChange(index, "maxRehab", e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
                   
                </div>
            ))}

<label>Loan Range:</label>
                <input type="text" value={loanRange.min} onChange={(e) => setLoanRange({ ...loanRange, min: e.target.value })} placeholder="Min" style={{ width: "48%", marginRight: "4%" }} />
                <input type="text" value={loanRange.max} onChange={(e) => setLoanRange({ ...loanRange, max: e.target.value })} placeholder="Max" style={{ width: "48%" }} />

                <label>Property Types:</label>
<div>
  {PROPERTY_TYPES.map((type) => (
    <label key={type}>
      <input
        type="checkbox"
        value={type}
        checked={propertyTypes.includes(type)}
        onChange={() => handlePropertyTypeChange(type)} // ✅ Using the function here
      />
      {type}
    </label>
  ))}
</div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={handleSave} style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>Save Changes</button>
                <button onClick={handleDelete} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>   Delete Loan Program </button>{" | "}
                <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
            </div>
        </div>
    
    );
}

export default EditFixAndFlip;