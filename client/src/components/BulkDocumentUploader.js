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

  const validMimeTypes = [
    "application/pdf", 
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => validMimeTypes.includes(file.type));
  
    if (files.length === 0) {
      alert("Invalid file type. Allowed: PDF, PNG, JPEG, DOC, DOCX.");
       return;
    }
    setSelectedFiles(files);
  };
  
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

  // ✅ Handle drag-and-drop
  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => validMimeTypes.includes(file.type));
    if (validFiles.length === 0) {
      alert("Invalid file type selected. Only PDF, Word, Excel, and images are allowed.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true, // ✅ Allow multiple files
    accept: validMimeTypes.join(", "),
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
    formData.append("tag", selectedTag);

    try {
      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/documents/bulk-upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Bulk upload successful!");
        setSelectedFiles([]);
        setSelectedLender("");
        setSelectedTag("");
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

      {/* ✅ Drag and Drop Area */}
      <div {...getRootProps()} style={{ border: "2px dashed gray", padding: "20px", cursor: "pointer", marginBottom: "10px" }}>
        <input {...getInputProps()} />
        <p>Drag & drop multiple files here, or click to select files</p>
      </div>

      {/* ✅ Standard File Upload (For users who prefer clicking) */}
      <input type="file" multiple onChange={handleFileChange} style={{ marginBottom: "10px" }} />

      {/* ✅ Display Selected Files */}
      {selectedFiles.length > 0 && (
        <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}

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
      {/* ✅ Upload Button */}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default BulkDocumentUploader;
