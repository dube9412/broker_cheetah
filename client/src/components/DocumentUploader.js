import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import uploadDocument from "../utils/uploadDocument"; // ✅ Reusing upload logic

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

const DocumentUploader = ({ lenderId, programId, loanPrograms }) => {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const validMimeTypes = [
    "application/pdf", "image/png", "image/jpeg", 
    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file && validMimeTypes.includes(file.type)) {
      setSelectedFile(file);
  } else {
      alert("Invalid file type. Allowed: PDF, PNG, JPEG, DOC, DOCX.");
      setSelectedFile(null);
  }
};


  // ✅ Handle drag-and-drop
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]); // Only take the first file
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false, // Only allow one file at a time
    accept: "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  // ✅ Handle document upload
  const handleUpload = async () => {
    if (!selectedFile || !selectedTag) {
      alert("Please select a document and a tag before uploading.");
      return;
    }

    const success = await uploadDocument(selectedFile, lenderId, programId ? programId : selectedProgram, selectedTag);

    if (success) {
      setSelectedFile(null);
      setSelectedTag("");
      setSelectedProgram("");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h3>Upload Document</h3>

      {/* ✅ Drag and Drop Area */}
      <div {...getRootProps()} style={{ border: "2px dashed gray", padding: "20px", cursor: "pointer", marginBottom: "10px" }}>
        <input {...getInputProps()} />
        {selectedFile ? <p>Selected File: {selectedFile.name}</p> : <p>Drag & drop a file here, or click to select a file</p>}
      </div>

      {/* ✅ Standard File Upload */}
      <input type="file" onChange={handleFileChange} />
      <br /><br />

      {/* ✅ Assign to Loan Program (Optional) */}
      <label>Assign to a Loan Program (Optional): </label>
      <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
    <option value="">None</option>
    {(Array.isArray(loanPrograms) && loanPrograms.length > 0) ? loanPrograms.map((program) => (

        <option key={program._id} value={program._id}>{program.name}</option>
    )) : null} {/* ✅ Prevents error if loanPrograms is undefined */}
</select>

      <br /><br />

      {/* ✅ Tag Selection */}
      <label>Tag this document: </label>
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

export default DocumentUploader;
