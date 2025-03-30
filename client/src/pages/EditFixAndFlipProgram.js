import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditFixAndFlipProgram() {
    const { lenderId, programId } = useParams();
    const navigate = useNavigate();
    const [programData, setProgramData] = useState({
        name: "",
        highlightNote: "", // Add highlightNote field
        // ...other fields...
    });

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await fetch(
                    `https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs/${programId}`
                );
                const data = await response.json();
                if (response.ok) {
                    setProgramData(data);
                } else {
                    console.error("Failed to fetch program:", data.message);
                }
            } catch (error) {
                console.error("Error fetching program:", error);
            }
        };

        fetchProgram();
    }, [lenderId, programId]);

    const handleChange = (e) => {
        setProgramData({ ...programData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs/${programId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(programData),
                }
            );

            if (response.ok) {
                alert("Program updated successfully!");
                navigate(`/manage-loan-programs/${lenderId}`);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error updating program:", error);
            alert("An error occurred while updating the program.");
        }
    };

    return (
        <div>
            <h1>Edit Fix and Flip Program</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Program Name:
                    <input
                        type="text"
                        name="name"
                        value={programData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Highlight Note:
                    <textarea
                        name="highlightNote"
                        value={programData.highlightNote}
                        onChange={handleChange}
                        placeholder="Enter a note explaining why this program is a good fit"
                        style={{ width: "100%", height: "100px" }}
                    />
                </label>
                <br />
                {/* Add other fields as needed */}
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate(`/manage-loan-programs/${lenderId}`)}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditFixAndFlipProgram;
