const uploadDocument = async (file, lenderId, programId = "", tag) => {
    if (!file || !tag) {
      alert("Please select a document and a tag before uploading.");
      return false;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lenderId", lenderId);
    formData.append("programId", programId || ""); // Optional programId
    formData.append("tag", tag);
  
    try {
      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/documents/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("✅ Document uploaded successfully!");
        return true;
      } else {
        alert(`❌ Upload failed: ${data.message}`);
        return false;
      }
    } catch (error) {
      console.error("❌ Error uploading document:", error);
      alert("❌ Error uploading document.");
      return false;
    }
  };
  
  export default uploadDocument;
  