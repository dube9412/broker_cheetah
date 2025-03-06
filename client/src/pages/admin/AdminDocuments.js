import React, { useState, useEffect } from "react";
import BulkDocumentUploader from "../../components/BulkDocumentUploader"; // ✅ Use Bulk Uploader
import { useNavigate } from "react-router-dom";

// ✅ Tag Categories
const DOCUMENT_CATEGORIES = [
  { label: "Loan Program Applications", options: [
    "DSCR Loan Application", 
    "Fix & Flip / Bridge Loan Application", 
    "Rental Portfolio Loan Application", 
    "Ground Up Construction Application", 
    "Scope of Work Worksheet"
  ]},
  { label: "General Underwriting & Processing Docs", options: [
    "Borrower Experience Sheet", 
    "Co-Signor (Guarantor) Sheet", 
    "Canadian National Credit Report Worksheet", 
    "Contractor Onboarding Worksheet",
    "Insurance Requirements", 
    "Mortgage Clause Info"
  ]},
  { label: "Lender Marketing Materials", options: [
    "Fix & Flip Marketing Sheet", 
    "Ground Up Marketing Sheet"
  ]},
  { label: "Lender Information & Guidelines", options: [
    "Product Info Sheet", 
    "Product Details Sheet", 
    "Lending Guidelines",     
    "How to Request a Draw"
  ]}
];

const AdminDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [lenders, setLenders] = useState([]);
  const [loanPrograms, setLoanPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

   // ✅ Fetch Lenders List (So we can display lender names)
   useEffect(() => {
    const fetchLenders = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
        const data = await response.json();
        if (response.ok) {
          console.log("✅ Fetched Lenders:", data);
          setLenders(data.lenders);
        } else {
          console.warn("⚠️ No lenders found.");
        }
      } catch (error) {
        console.error("❌ Error fetching lenders:", error);
      }
    };

    fetchLenders();
  }, []);

  // ✅ Fetch Loan Programs (Needed for program assignment)
  useEffect(() => {
    const fetchLoanPrograms = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/loan-programs");
        const data = await response.json();
        if (response.ok) {
          setLoanPrograms(data.programs);
        }
      } catch (error) {
        console.error("❌ Error fetching loan programs:", error);
      }
    };
    fetchLoanPrograms();
  }, []);

  // ✅ Fetch ALL documents (Both General & Program-Specific)
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/documents");
        const data = await response.json();

        if (response.ok) {
          console.log("✅ Fetched All Documents:", data.documents);
          setDocuments(data.documents);
        } else {
          console.warn("⚠️ No documents found.");
          setDocuments([]);
        }
      } catch (error) {
        console.error("❌ Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

   // ✅ Assign Loan Program to Document
   const handleAssignProgram = async (documentId, newProgramId) => {
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/documents/${documentId}/reassign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newProgramId }),
      });

      if (response.ok) {
        alert("✅ Document assigned to program.");
        setDocuments(prevDocs => prevDocs.map(doc => (doc._id === documentId ? { ...doc, programId: newProgramId } : doc)));
      } else {
        alert("❌ Error assigning program.");
      }
    } catch (error) {
      console.error("❌ Error assigning document:", error);
    }
  };

  const handleAssignTag = async (documentId, newTag) => {
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/documents/${documentId}/assign-tag`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newTag }),
      });

      if (response.ok) {
        alert("✅ Tag assigned successfully.");
        setDocuments(prevDocs => prevDocs.map(doc => (doc._id === documentId ? { ...doc, tag: newTag } : doc)));
      } else {
        alert("❌ Error assigning tag.");
      }
    } catch (error) {
      console.error("❌ Error assigning tag:", error);
    }
  };


  // ✅ Handle Document Deletion
  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Document deleted successfully.");
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== documentId));
      } else {
        alert("❌ Error deleting document.");
      }
    } catch (error) {
      console.error("❌ Error deleting document:", error);
    }
  };

  // ✅ Handle Document Reassignment
  const handleReassignDocument = async (documentId, newLenderId, newProgramId) => {
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/documents/${documentId}/reassign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newLenderId, newProgramId }),
      });

      if (response.ok) {
        alert("✅ Document reassigned successfully.");
        setDocuments(prevDocs =>
          prevDocs.map(doc => (doc._id === documentId ? { ...doc, lenderId: newLenderId, programId: newProgramId } : doc))
        );
      } else {
        alert("❌ Error reassigning document.");
      }
    } catch (error) {
      console.error("❌ Error reassigning document:", error);
    }
  };

    // ✅ Filter documents by Lender
    const filteredDocuments = useMemo(() => {
      return documents.filter(doc =>
        lenders.find(lender => lender._id === doc.lenderId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [documents, lenders, searchTerm]);

  if (loading) return <p>Loading documents...</p>;

  return (
    <div>
      <h1>📂 Admin Document Management</h1>

      {/* ✅ Bulk Upload Section */}
      <BulkDocumentUploader lenders={lenders} />

       {/* ✅ Search by Lender */}
       <input
        type="text"
        placeholder="Search by Lender"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "10px 0", padding: "5px", width: "200px" }}
      />

            {/* ✅ List of Documents */}
            <h2>📄 All Documents</h2>
      {filteredDocuments.length === 0 ? <p>No documents uploaded yet.</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Lender</th>
              <th>Tag</th>
              <th>Loan Program</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map(doc => {
              const lenderName = lenders.find(l => l._id === doc.lenderId)?.name || "Unknown Lender";
              return (
                <tr key={doc._id}>
                  <td>{doc.originalName}</td>
                  <td>{lenderName}</td>
                  <td>
                    <select value={doc.tag || ""} onChange={(e) => handleAssignTag(doc._id, e.target.value)}>
                      <option value="">Select a Tag</option>
                      {DOCUMENT_CATEGORIES.map(category => (
                        <optgroup key={category.label} label={category.label}>
                          {category.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={doc.programId || ""} onChange={(e) => handleAssignProgram(doc._id, e.target.value)}>
                      <option value="">Unassigned</option>
                      {loanPrograms.map(program => (
                        <option key={program._id} value={program._id}>{program.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => window.open(`/api/documents/view/${doc._id}`, "_blank")}>View</button>
                    <button onClick={() => handleReassignDocument(doc._id)}>Reassign</button>
                    <button onClick={() => handleDeleteDocument(doc._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/admin-dashboard")}>Back to Admin</button>
    </div>
  );
};

export default AdminDocuments;