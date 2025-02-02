import React, { useState, useEffect } from "react";
import { DSCRSchema } from "../Tier"; // Import the DSCR schema

function DSCRLoanForm({ program, tierData, setTierData, onSave }) {
    const [formData, setFormData] = useState({ ...program });

    useEffect(() => {
        setFormData({ ...program });
    }, [program]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTierChange = (index, field, value) => {
        const updatedTiers = [...tierData];
        updatedTiers[index][field] = value;
        setTierData(updatedTiers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProgram = { ...formData, tiers: tierData };
        onSave(updatedProgram);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>DSCR Loan Form</h3>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} /><br />
            {/* ... other common fields (lender, etc.) ... */}

            {/* DSCR Specific Fields */}
            <label>Min DSCR Ratio:</label>
            <input type="number" name="minDSCRRatio" value={formData.minDSCRRatio || ''} onChange={handleChange} /><br />
            <label>Max LTV:</label>
            <input type="number" name="maxLTV" value={formData.maxLTV || ''} onChange={handleChange} /><br />
            {/* ... other DSCR fields ... */}

            {/* Tier Handling */}
            {tierData.map((tier, index) => (
                <div key={index}>
                    <h4>Tier {tier.tier}</h4>
                    {Object.keys(DSCRSchema.obj).filter(key => key !== 'tier').map(key => (
                        <div key={key}>
                            <label>{key.toUpperCase()}:</label>
                            <input
                                type="number"
                                name={key}
                                value={tier[key] || ''}
                                onChange={(e) => handleTierChange(index, key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            ))}

            <button type="submit">Save</button>
        </form>
    );
}

export default DSCRLoanForm;