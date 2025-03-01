import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { LenderAuthContext } from "../../context/LenderAuthContext"; // ✅ Ensure context is used

const LenderManageLoanPrograms = () => {
    const { lenderUserId } = useContext(LenderAuthContext);
    const { lenderId } = useParams();
    const navigate = useNavigate();

    const [loanPrograms, setLoanPrograms] = useState([]);

    useEffect(() => {
        if (!lenderUserId || lenderId !== lenderUserId) {
            navigate("/lender/dashboard"); // ✅ Redirect unauthorized lenders
            return;
        }

        const fetchLoanPrograms = async () => {
            try {
                const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/loan-programs/${lenderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setLoanPrograms(data.loanPrograms);
                } else {
                    console.error("❌ Error fetching loan programs:", data.message);
                }
            } catch (error) {
                console.error("❌ API Error:", error);
            }
        };

        fetchLoanPrograms();
    }, [lenderId, lenderUserId, navigate]);

    return (
        <div>
            <h1>Manage Loan Programs</h1>
            <button onClick={() => navigate(`/lender/add-loan-program/${lenderId}`)}>Add Loan Program</button>

            <table border="1" cellPadding="6" style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>Loan Type</th>
                        <th>Min FICO</th>
                        <th>Max LTV</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loanPrograms.length > 0 ? (
                        loanPrograms.map((program) => (
                            <tr key={program._id}>
                                <td>{program.loanType}</td>
                                <td>{program.minFICO}</td>
                                <td>{program.maxLTV}</td>
                                <td>
                                    <Link to={`/lender/edit-loan-program/${program._id}`}>
                                        <button>Edit</button>
                                    </Link> {" | "}
                                    <button onClick={() => navigate(`/lender/upload-docs/${program._id}`)}>Upload Docs</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No loan programs found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button onClick={() => navigate("/lender/dashboard")} style={{ marginTop: "20px" }}>Back to Dashboard</button>
        </div>
    );
};

export default LenderManageLoanPrograms;
