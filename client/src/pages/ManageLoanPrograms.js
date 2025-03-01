import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import DocumentUploader from "../components/DocumentUploader"; // ✅ Import Document Upload

function ManageLoanPrograms() {
  const { lenderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/admin-dashboard"; // ✅ Default return path

  const [lender, setLender] = useState(null);
  const [loanPrograms, setLoanPrograms] = useState([]); // ✅ Store all programs in one state
  const [showUploader, setShowUploader] = useState(null); // ✅ Track which program is uploading

  // ✅ Fetch function for loan programs
  useEffect(() => {
    const fetchLenderAndPrograms = async () => {
      try {
        const lenderResponse = await fetch(
          `https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`
        );
        if (lenderResponse.ok) {
          const lenderData = await lenderResponse.json();
          setLender(lenderData);
        } else {
          console.error("❌ Failed to fetch lender:", lenderResponse.status);
        }

        const programsResponse = await fetch(
          `https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}/loan-programs`
        );
        if (programsResponse.ok) {
          const programsData = await programsResponse.json();
          setLoanPrograms(programsData.loanPrograms || []);
        } else {
          console.error("❌ Failed to fetch loan programs:", programsResponse.status);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchLenderAndPrograms();
  }, [lenderId]);

  // ✅ DELETE Function for Loan Programs
  const handleDeleteLoanProgram = async (programId) => {
    if (!window.confirm("Are you sure you want to delete this loan program?")) return;

    try {
      const response = await fetch(
        `https://broker-cheetah-backend.onrender.com/api/loan-programs/${lenderId}/${programId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Loan program deleted successfully.");
        setLoanPrograms((prev) => prev.filter((program) => program._id !== programId));
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to delete loan program: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Error deleting loan program:", error);
      alert("An error occurred while deleting the loan program.");
    }
  };

  return (
    <div>
      <h1>Manage Loan Programs for {lender?.name || "Loading..."}</h1>

      <h2>EXISTING LOAN PROGRAMS</h2>
      <ul>
        {loanPrograms.length > 0 ? (
          loanPrograms.map((program) => (
            <li key={program._id}>
              <strong>{program.name}</strong>
              <Link to={`/edit-${program.type.toLowerCase().replace(/ /g, "-")}-program/${lenderId}/${program._id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => setShowUploader(program._id)}>Upload Docs</button>
              <button onClick={() => handleDeleteLoanProgram(program._id)}>Delete</button>

              {showUploader === program._id && (
                <DocumentUploader lenderId={lenderId} loanProgramId={program._id} />
              )}
            </li>
          ))
        ) : (
          <p>No loan programs available.</p>
        )}
      </ul>

      <button
        onClick={() => navigate(returnTo.startsWith("/") ? returnTo : `/${returnTo}`)}
        style={{ marginTop: "20px" }}
      >
        Back
      </button>
    </div>
  );
}

export default ManageLoanPrograms;
