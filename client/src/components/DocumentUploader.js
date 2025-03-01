import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDocument } from "../services/documentService"; // ✅ API CALLS

const DocumentUploader = ({ lenderId, loanProgramId }) => {
  const [file, setFile] = useState(null);
  const [customName, setCustomName] = useState("");
  const [selectedLoanProgram, setSelectedLoanProgram] = useState(loanProgramId || "");
  const [loanPrograms, setLoanPrograms] = useState([]);
  const [tag, setTag] = useState("");

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setCustomName(acceptedFiles[0].name);
  };

  // ✅ Fetch Loan Programs for Dropdown
  useEffect(() => {
    const fetchLoanPrograms = async () => {
      if (!lenderId) return;
      try {
        const response = await fetch(
          `https://broker-cheetah-backend.onrender.com/api/lenders/${lenderId}/loan-programs`
        );
        const data = await response.json();
        if (response.ok) {
          setLoanPrograms(data.loanPrograms);
        } else {
          console.error("Error fetching loan programs", data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchLoanPrograms();
  }, [lenderId]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    if (!tag) return alert("Please enter a document tag (e.g., 'Credit Report', 'P&L Statement').");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("customName", customName);
    formData.append("lenderId", lenderId);
    formData.append("loanProgramId", selectedLoanProgram);
    formData.append("tag", tag);

    const response = await uploadDocument(formData);
    if (response.success) {
      alert("File uploaded successfully!");
      setFile(null);
      setCustomName("");
      setSelectedLoanProgram("");
      setTag("");
    } else {
      alert("Upload failed.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <h3>Upload Document</h3>
      <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: 20 }}>
        <input {...getInputProps()} />
        <p>{file ? file.name : "Drag & drop a file here, or click to select file"}</p>
      </div>

      {file && (
        <>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Rename file"
          />

          {/* ✅ Assign to Loan Program (if applicable) */}
          <select
            value={selectedLoanProgram}
            onChange={(e) => setSelectedLoanProgram(e.target.value)}
          >
            <option value="">Assign to a Loan Program (Optional)</option>
            {loanPrograms.map((program) => (
              <option key={program._id} value={program._id}>
                {program.name}
              </option>
            ))}
          </select>

          {/* ✅ Document Tag (Mandatory) */}
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag this document (e.g., 'Credit Report')"
          />

          <button onClick={handleUpload}>Upload</button>
        </>
      )}
    </div>
  );
};

export default DocumentUploader;

