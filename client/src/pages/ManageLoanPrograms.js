import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import DocumentUploader from "../components/DocumentUploader"; // ✅ Import

function ManageLoanPrograms() {
  const { lenderId, programId} = useParams();
  const navigate = useNavigate();

  const [lender, setLender] = useState(null);
  const [fixAndFlipPrograms, setFixAndFlipPrograms] = useState([]);
  const [dscrPrograms, setDscrPrograms] = useState([]);
  const [stabilizedBridgePrograms, setStabilizedBridgePrograms] = useState([]);
  const [portfolioPrograms, setPortfolioPrograms] = useState([]);
  const [groundUpPrograms, setGroundUpPrograms] = useState([]);
  const [showUploader, setShowUploader] = useState(null); // ✅ Track which program is uploading
  const [uploadedDocs, setUploadedDocs] = useState({});

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/admin-dashboard"; // ✅ Define it before using it

  // ✅ Fetch function for loan programs
  const fetchPrograms = async (url, stateSetter) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        stateSetter(Array.isArray(data) ? data : []);
      } else {
        console.warn(`⚠️ No programs found for ${url}`);
        stateSetter([]);
      }
    } catch (error) {
      console.error(`❌ Error fetching programs from ${url}:`, error);
    }
  };

  useEffect(() => {
    const fetchLender = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}`);
        if (response.ok) {
          const data = await response.json();
          setLender(data);
        } else {
          console.error(`❌ Failed to fetch lender: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Error fetching lender:", error);
      }
    };

    const fetchData = async () => {
      const programEndpoints = [
        { stateSetter: setFixAndFlipPrograms, url: `https://broker-cheetah-backend.onrender.com/api/fix-and-flip/${lenderId}/fix-and-flip-programs` },
        { stateSetter: setDscrPrograms, url: `https://broker-cheetah-backend.onrender.com/api/dscr/${lenderId}/dscr-programs` },
        { stateSetter: setStabilizedBridgePrograms, url: `https://broker-cheetah-backend.onrender.com/api/stabilized-bridge/${lenderId}/stabilized-bridge-programs` },
        { stateSetter: setPortfolioPrograms, url: `https://broker-cheetah-backend.onrender.com/api/portfolio/${lenderId}/portfolio-programs` },
        { stateSetter: setGroundUpPrograms, url: `https://broker-cheetah-backend.onrender.com/api/ground-up/${lenderId}/ground-up-programs` },
      ];

      for (const { stateSetter, url } of programEndpoints) {
        await fetchPrograms(url, stateSetter);
      }
    };

    const fetchDocuments = async () => {
      try {
          const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/documents/${lenderId}`);
          const data = await response.json();
  
          if (response.ok && data.success) {
              console.log("✅ Fetched Documents:", data.documents);
  
              // 🔹 Ensure documents are stored under their respective programId
              const docMap = {};
              data.documents.forEach(doc => {
                  const programKey = doc.programId || "general"; // Default to "general" for non-program-specific docs
                  if (!docMap[programKey]) {
                      docMap[programKey] = [];
                  }
                  docMap[programKey].push(doc);
              });
  
              setUploadedDocs(docMap);
          } else {
              console.warn("⚠️ No documents found.");
              setUploadedDocs({});
          }
      } catch (error) {
          console.error("❌ Error fetching documents:", error);
      }
  };
  
  
  
    fetchLender();
    fetchData();
    fetchDocuments(programId);
  }, [lenderId]);

  // ✅ DELETE Function for Loan Programs
  const handleDeleteLoanProgram = async (programId, programType) => {
    if (!window.confirm("Are you sure you want to delete this loan program?")) return;

    try {
      console.log(`🔹 Attempting to delete: ${programId}, Type: ${programType}`);

      const loanTypeMapping = {
        "Fix and Flip": "fix-and-flip",
        "DSCR": "dscr",
        "Ground Up": "ground-up",
        "Portfolio": "portfolio",
        "Stabilized Bridge": "stabilized-bridge",
      };

      const loanTypePath = loanTypeMapping[programType];

      if (!loanTypePath) {
        console.error("❌ Unknown loan program type:", programType);
        alert("Error deleting loan program. Unknown program type.");
        return;
      }

      const response = await fetch(
        `https://broker-cheetah-backend.onrender.com/api/${loanTypePath}/${lenderId}/${loanTypePath}-programs/${programId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("✅ Loan program deleted.");
        alert("Loan program deleted successfully.");
        window.location.reload();
      } else {
        console.error("❌ Error deleting loan program:", response.status);
        alert("Failed to delete loan program.");
      }
    } catch (error) {
      console.error("❌ Error deleting loan program:", error);
      alert("An error occurred while deleting the loan program.");
    }
  };

  const handleDeleteDocument = async (documentId, programId) => {
    if (!documentId) {
        console.error("❌ Error: No document ID provided for deletion.");
        alert("Error: No document ID provided.");
        return;
    }

    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/documents/${documentId}`, {
            method: "DELETE",
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Document deleted successfully.");

            // ✅ Update state to remove the deleted document from `uploadedDocs`
            setUploadedDocs((prevDocs) => {
                const updatedDocs = { ...prevDocs };
                if (updatedDocs[programId]) {
                    updatedDocs[programId] = updatedDocs[programId].filter((doc) => doc._id !== documentId);
                }
                return updatedDocs;
            });
        } else {
            alert(`❌ Error deleting document: ${data.message}`);
        }
    } catch (error) {
        console.error("❌ Error deleting document:", error);
        alert("An error occurred while deleting the document.");
    }
};

console.log("📂 Documents in State:", uploadedDocs);
console.log("📂 Program ID:", program._id);
console.log("📂 Docs for this Program:", uploadedDocs[program._id]);


  return (
    <div>
      <h1>Manage Loan Programs for {lender?.name || "Loading..."}</h1>

      {/* ✅ Add Loan Programs Section (Restored) */}
      <h2>LOAN PROGRAMS</h2>
      <h3>Residential 1-4</h3>
      <div>
        <Link to={`/add-fix-and-flip-program/${lenderId}`}><button>Add Fix and Flip Program</button></Link>
        {" | "}
        <Link to={`/add-dscr-program/${lenderId}`}><button>Add DSCR Loan Program</button></Link>
        {" | "}
        <Link to={`/add-ground-up-program/${lenderId}`}><button>Add Ground Up Loan Program</button></Link>
        {" | "}
        <Link to={`/add-portfolio-program/${lenderId}`}><button>Add Portfolio Loan</button></Link>
        {" | "}
        <Link to={`/add-stabilized-bridge-program/${lenderId}`}><button>Add Stabilized Bridge Loan Program</button></Link>
      </div>

      <h3>Multi-Family Programs</h3>
      <button>MF Fix and Flip</button>{" | "}
      <button>MF DSCR</button>{" | "}
      <button>MF Ground Up</button>{" | "}
      <button>MF Stabilized Bridge</button>{" | "}
      <button>MF Portfolio</button>{" | "}

      <h3>Commercial Programs</h3>
      <button>Mixed Use</button>{" | "}
      <button>General Commercial</button>{" | "}

      {/* ✅ EXISTING LOAN PROGRAMS SECTION */}
      <h2>EXISTING LOAN PROGRAMS</h2>
      <ul>
  {[...fixAndFlipPrograms, ...dscrPrograms, ...groundUpPrograms, ...portfolioPrograms, ...stabilizedBridgePrograms].map((program) => (
    <li key={program._id}>
      <strong>{program.name}</strong>
      <Link to={`/edit-${program.type.toLowerCase().replace(/ /g, "-")}-program/${lenderId}/${program._id}`}>
        <button>Edit</button>
      </Link>
      {" | "}
      <button onClick={() => handleDeleteLoanProgram(program._id, program.type)}>
        Delete
      </button>
      {" | "}
      <button onClick={() => setShowUploader(program._id)}>Upload Docs</button>

      {/* ✅ Show Document Uploader when Upload Button is Clicked */}
      {showUploader === program._id && <DocumentUploader lenderId={lenderId} programId={program._id} />}

      {/* ✅ Fix: Make sure uploadedDocs[program._id] exists before mapping */}
      {uploadedDocs?.[program._id]?.length > 0 ? (
        uploadedDocs[program._id].map((doc) => (
          <div key={doc._id}>
            📄 {doc.originalName} ({doc.tag})
            <button onClick={() => handleDeleteDocument(doc._id, program._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No documents uploaded for this program.</p>
      )}
    </li>
  ))}
</ul>


      <button onClick={() => navigate(returnTo.startsWith("/") ? returnTo : `/${returnTo}`)} style={{ marginTop: "20px" }}>
        Back
      </button>
    </div>
  );
}

export default ManageLoanPrograms;
