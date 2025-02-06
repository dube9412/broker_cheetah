import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditFixAndFlip() {
    const { lenderId, programId } = useParams();
    const navigate = useNavigate();

    const [lender, setLender] = useState(null);
    const [programName, setProgramName] = useState('');
    const [numTiers, setNumTiers] = useState(1);
    const [tierData, setTierData] = useState();

    useEffect(() => {
        // Fetch lender and program details
        const fetchDetails = async () => {
            try {
                const lenderResponse = await fetch(`/api/lenders/${lenderId}`);
                const lenderData = await lenderResponse.json();
                setLender(lenderData);

                const programResponse = await fetch(`/api/loan-programs/${programId}`);
                const programData = await programResponse.json();
                setProgramName(programData.name);
                setNumTiers(programData.tiers.length);
                setTierData(programData.tiers);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };

        fetchDetails();
    }, [lenderId, programId]);

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
            type: 'Fix and Flip',
            tiers: tierData,
        };

        try {
            const response = await fetch(`/api/loan-programs/${programId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(programData),
            });

            if (response.ok) {
                // Handle success (e.g., redirect to ManageLoanPrograms page)
                navigate(`/manage-loan-programs/${lenderId}`);
            } else {
                const errorData = await response.json();
                console.error("Error updating loan program:", errorData.message || "Server error");
                alert("Error updating loan program. Please check the console for details.");
            }
        } catch (error) {
            console.error("Error updating loan program:", error);
            alert("Error updating loan program. Please check the console for details.");
        }
    };

    return (
        <div>
            <h1>Edit Fix and Flip Loan Program for {lender? lender.name: 'Lender'}</h1>
            <form onSubmit={handleSubmit}>
                {/*... (rest of the form is similar to AddFixAndFlip.js) */}
                <button type="submit">Update Loan Program</button>
            </form>
        </div>
    );
}

export default EditFixAndFlip;