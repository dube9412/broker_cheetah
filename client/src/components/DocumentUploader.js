import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadDocument } from '../services/documentService';

const DocumentUploader = ({ loanPrograms, userId }) => {
  const [file, setFile] = useState(null);
  const [customName, setCustomName] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const onDrop = acceptedFiles => {
    setFile(acceptedFiles[0]);
    setCustomName(acceptedFiles[0].name);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('customName', customName);
    formData.append('loanPrograms', JSON.stringify(selectedPrograms));
    formData.append('uploadedBy', userId);

    const response = await uploadDocument(formData);
    if (response.success) {
      alert('File uploaded successfully!');
      setFile(null);
      setCustomName('');
      setSelectedPrograms([]);
    } else {
      alert('Upload failed.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: 20 }}>
        <input {...getInputProps()} />
        <p>{file ? file.name : 'Drag & drop a file here, or click to select file'}</p>
      </div>

      {file && (
        <>
          <input
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            placeholder="Rename file"
          />

          <select multiple value={selectedPrograms} onChange={e =>
            setSelectedPrograms([...e.target.selectedOptions].map(o => o.value))
          }>
            {loanPrograms.map(program => (
              <option key={program._id} value={program.name}>{program.name}</option>
            ))}
          </select>

          <button onClick={handleUpload}>Upload</button>
        </>
      )}
    </div>
  );
};

export default DocumentUploader;
