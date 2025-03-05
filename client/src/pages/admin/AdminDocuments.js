import React, { useState, useEffect } from "react";
import BulkDocumentUploader from "../../components/BulkDocumentUploader"; // ✅ Use Bulk Uploader
import { useNavigate } from "react-router-dom";

const AdminDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [lenders, setLenders] = useState([]); // ✅ Store lender data
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
        setDocuments((prevDocs) =>
          prevDocs.map((doc) => (doc._id === documentId ? { ...doc, lenderId: newLenderId, programId: newProgramId } : doc))
        );
      } else {
        alert("❌ Error reassigning document.");
      }
    } catch (error) {
      console.error("❌ Error reassigning document:", error);
    }
  };

  if (loading) return <p>Loading documents...</p>;

  return (
    <div>
      <h1>📂 Admin Document Management</h1>

      {/* ✅ Bulk Upload Section */}
      <BulkDocumentUploader isBulk={true} />

      {/* ✅ List of Documents */}
      <h2>📄 All Documents</h2>
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul>
          {documents.map((doc) => {
            const lenderName = lenders.find(l => l._id === doc.lenderId)?.name || "Unknown Lender";
            return (
              <li key={doc._id}>
                📄 {doc.originalName} ({doc.tag}) - Lender: {lenderName}
                <button onClick={() => window.open(`https://broker-cheetah-backend.onrender.com/api/documents/view/${doc._id}`, "_blank")}>View</button>
                <button onClick={() => handleDeleteDocument(doc._id)}>Delete</button>
                <button onClick={() => handleReassignDocument(doc._id, "NEW_LENDER_ID", "NEW_PROGRAM_ID")}>Reassign</button>
              </li>
            );
          })}
        </ul>
      )}

      <button onClick={() => navigate("/admin-dashboard")} style={{ marginTop: "20px" }}>Back to Admin</button>
    </div>
  );
};

export default AdminDocuments;

