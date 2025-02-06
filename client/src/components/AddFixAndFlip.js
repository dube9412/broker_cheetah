import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AddFixAndFlip() {
    const { lenderId } = useParams();
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [programName, setProgramName] = useState('');
    const [numTiers, setNumTiers] = useState(1);
    // State for each input field in the form
    const [minFICO, setMinFICO] = useState('');
    const [minExperience, setMinExperience] = useState('');
    const [maxLTP, setMaxLTP] = useState('');
    const [totalLTC, setTotalLTC] = useState('');
    const [maxARV, setMaxARV] = useState('');
    const [minLoanAmount, setMinLoanAmount] = useState('');
    const [maxLoanAmount, setMaxLoanAmount] = useState('');

    useEffect(() => {
        // Fetch lender details
        const fetchLender = async () => {
            try {
                const response = await fetch(`/api/lenders/${lenderId}`);
                const data = await response.json();
                setLender(data);
            } catch (error) {
                console.error('Error fetching lender details:', error);
            }
        };

        fetchLender();
    }, [lenderId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add logic to submit the form data to the server
        try {
            const response = await fetch(`http://localhost:5000/api/loan-programs/${lenderId}/fix-and-flip-programs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: programName,  // ✅ Rename 'programName' to 'name'
                    type: "Fix and Flip", // ✅ Add required 'type'
                    lender: lenderId, // ✅ Ensure lenderId is included
                    numTiers,
                    minFICO,
                    minExperience,
                    maxLTP,
                    totalLTC,
                    maxARV,
                    minLoanAmount,
                    maxLoanAmount
                })
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
            console.error('Error adding program:', error);
            alert('An error occurred while adding the program');
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>
                {lender ? `Adding Loan Program for ${lender.name}` : "Loading Lender..."}
            </h2>

            <form onSubmit={handleSubmit}>
                <label>Program Name:</label>
                <input type="text" value={programName} onChange={(e) => setProgramName(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <label>Number of Tiers:</label>
                <input type="number" value={numTiers} onChange={(e) => setNumTiers(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <label>Minimum FICO:</label>
                <input type="number" value={minFICO} onChange={(e) => setMinFICO(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <label>Minimum Experience:</label>
                <input type="number" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <label>Maximum LTP:</label>
                <input type="number" value={maxLTP} onChange={(e) => setMaxLTP(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <label>Total LTC:</label>
                <input type="number" value={totalLTC} onChange={(e) => setTotalLTC(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <label>Maximum ARV:</label>
                <input type="number" value={maxARV} onChange={(e) => setMaxARV(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <label>Minimum Loan Amount:</label>
                <input type="number" value={minLoanAmount} onChange={(e) => setMinLoanAmount(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <label>Maximum Loan Amount:</label>
                <input type="number" value={maxLoanAmount} onChange={(e) => setMaxLoanAmount(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button type="submit" style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>
                        Add Program
                    </button>
                    <button onClick={() => navigate(`/manage-loan-programs/${lenderId}`)} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddFixAndFlip;