import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

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
    "How to Request a Draw", 
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
    "Lending Guidelines"
  ]}
];

const BulkDocumentUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedLender, setSelectedLender] = useState(""); // ✅ Define lender selection
  const [lenders, setLenders] = useState([]); // ✅ Store lender list

  // ✅ Fetch Lenders List (For Assigning Documents)
  useEffect(() => {
    const fetchLenders = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
        const data = await response.json();
        if (response.ok) {
          console.log("✅ Fetched Lenders:", data.lenders);
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

  // ✅ Handle Drag & Drop
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpeg,.jpg",
  });

  // ✅ Handle Bulk Upload
  const handleUpload = async () => {
    if (!selectedLender) {
      alert("Please select a lender before uploading.");
      return;
    }
    if (selectedFiles.length === 0 || !selectedTag) {
      alert("Please select files and a tag before uploading.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append("files", file));
    formData.append("lenderId", selectedLender);

    try {
      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/documents/bulk-upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Bulk upload successful!");
        setSelectedFiles([]);
        setSelectedLender("");
      } else {
        alert("❌ Error uploading documents.");
      }
    } catch (error) {
      console.error("❌ Error uploading documents:", error);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h3>📂 Bulk Upload Documents</h3>

      {/* ✅ Lender Selection */}
      <label>Assign Lender: </label>
      <select value={selectedLender} onChange={(e) => setSelectedLender(e.target.value)}>
        <option value="">Unassigned</option>
        {lenders.map((lender) => (
          <option key={lender._id} value={lender._id}>{lender.name}</option>
        ))}
      </select>
      <br /><br />

      {/* ✅ Drag and Drop Area */}
      <div {...getRootProps()} style={{ border: "2px dashed gray", padding: "20px", cursor: "pointer", marginBottom: "10px" }}>
        <input {...getInputProps()} />
        <p>Drag & drop multiple files here, or click to select files</p>
      </div>

      {/* ✅ Tag Selection */}
      <label>Tag these documents: </label>
      <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
        <option value="">Select a Tag</option>
        {DOCUMENT_CATEGORIES.map((category) => (
          <optgroup key={category.label} label={category.label}>
            {category.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <br /><br />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default BulkDocumentUploader;
