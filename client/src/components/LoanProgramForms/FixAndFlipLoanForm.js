import React, { useState, useEffect } from "react";
import { FixAndFlipSchema } from "../Tier"; // Import the schema

function FixAndFlipLoanForm({ program, tierData, setTierData, onSave }) {
    const [formData, setFormData] = useState({ ...program }); // Initialize with program data

    useEffect(() => {
        setFormData({ ...program }); // Update form data when program prop changes
    }, [program]); // Add program to dependency array

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
            <h3>Fix and Flip Loan Form</h3>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} /><br />
            {/* ... other common fields (lender, etc.) ... */}

            {/* Fix and Flip Specific Fields */}
            <label>Max LTP:</label>
            <input type="number" name="maxLTP" value={formData.maxLTP || ''} onChange={handleChange} /><br />
            {/* ... other Fix and Flip fields ... */}

            {/* Tier Handling */}
            {tierData.map((tier, index) => (
                <div key={index}>
                    <h4>Tier {tier.tier}</h4>
                    {Object.keys(FixAndFlipSchema.obj).filter(key => key !== 'tier').map(key => (
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

export default FixAndFlipLoanForm;