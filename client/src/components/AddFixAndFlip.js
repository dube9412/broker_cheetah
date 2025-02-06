import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AddFixAndFlip() {
    const { lenderId } = useParams();
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [programName, setProgramName] = useState('');
    const [numTiers, setNumTiers] = useState(1);
    const [tierData, setTierData] = useState();

    useEffect(() => {
        // Fetch lender details (if needed)
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

    useEffect(() => {
        // Initialize tierData with an empty array of tiers
        const initialTierData = Array.from({ length: numTiers }, (_, i) => ({
            tierName: `Tier ${i + 1}`,
            minFICO: '',
            minExperience: '',
            maxLTP: '',
            totalLTC: '',
            maxARV: '',
            minLoanAmount: '',
            maxLoanAmount: '',
        }));
        setTierData(initialTierData);
    }, [numTiers]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'programName') {
            setProgramName(value);
        } else if (name === 'numTiers') {
            setNumTiers(parseInt(value, 10) || 1);
        }
    };

    const handleTierChange = (tierIndex, field, value) => {
        setTierData(prevTierData => {
            const updatedTiers = [...prevTierData];
            updatedTiers[tierIndex][field] = value;
            return updatedTiers;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const programData = {
            name: programName,
            lender: lenderId,
            type: 'Fix and Flip', // Explicitly set the type
            tiers: tierData,
        };

        try {
            const response = await fetch('/api/loan-programs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(programData),
            });

            if (response.ok) {
                // Handle success (e.g., redirect to ManageLoanPrograms page)
                navigate(`/manage-loan-programs/${lenderId}`);
            } else {
                const errorData = await response.json();
                console.error("Error adding loan program:", errorData.message || "Server error");
                alert("Error adding loan program. Please check the console for details.");
            }
        } catch (error) {
            console.error("Error adding loan program:", error);
            alert("Error adding loan program. Please check the console for details.");
        }
    };

    return (
        <div>
            <h1>Add Fix and Flip Loan Program for {lender? lender.name: 'Lender'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="programName">Program Name:</label>
                    <input
                        type="text"
                        id="programName"
                        name="programName"
                        value={programName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="numTiers">Number of Tiers:</label>
                    <input
                        type="number"
                        id="numTiers"
                        name="numTiers"
                        min="1"
                        value={numTiers}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {tierData.map((tier, tierIndex) => (
                    <div key={tierIndex}>
                        <h3>{tier.tierName}</h3>
                        {/* Input fields for each tier */}
                        <div>
                            <label htmlFor={`minFICO-${tierIndex}`}>Min FICO:</label>
                            <input
                                type="number"
                                id={`minFICO-${tierIndex}`}
                                name="minFICO"
                                value={tier.minFICO}
                                onChange={(e) => handleTierChange(tierIndex, 'minFICO', e.target.value)}
                                required
                            />
                        </div>
                        {/*... other input fields for the tier... */}
                    </div>
                ))}
                <button type="submit">Save Loan Program</button>
            </form>
        </div>
    );
}

export default AddFixAndFlip;