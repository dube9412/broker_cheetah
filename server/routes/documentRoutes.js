const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../models/Document"); // ✅ Ensure this model exists
const path = require("path");

// ✅ Multer Storage Config (Stores files in "uploads/")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Change this if needed for a cloud solution (e.g., AWS S3)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// ✅ Upload a Document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const { lenderId, programId, tag } = req.body;

    // ✅ Ensure required fields exist
    if (!lenderId || !tag) {
      return res.status(400).json({ success: false, message: "Lender ID and Tag are required." });
    }

    const newDocument = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`, // Adjust if using cloud storage
      lenderId,
      programId: programId || null, // Optional
      tag,
    });

    await newDocument.save();
    res.status(201).json({ success: true, message: "Document uploaded successfully!", document: newDocument });
  } catch (error) {
    console.error("❌ Error uploading document:", error);
    res.status(500).json({ success: false, message: "Error uploading document." });
  }
});

// ✅ Serve Uploaded Files
router.get("/file/:filename", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "uploads", req.params.filename);
    console.log("📂 Serving File:", filePath);

    res.sendFile(filePath);
  } catch (error) {
    console.error("❌ Error fetching document file:", error);
    res.status(500).json({ success: false, message: "Error fetching document file." });
  }
});



// ✅ Fetch Documents for a Specific Lender (Optional Program Filter)
router.get("/:lenderId", async (req, res) => {
  try {
      const { lenderId } = req.params;
      const { programId } = req.query;

      // ✅ Fetch both general lender-wide documents & program-specific ones
      let query = { lenderId };
      if (programId) {
          query = { 
              $or: [
                  { lenderId, programId },  // ✅ Match program-specific docs
                  { lenderId, programId: null }, // ✅ Also fetch lender-wide docs
              ]
          };
      }

      const documents = await Document.find(query);
      res.status(200).json({ success: true, documents });
  } catch (error) {
      console.error("❌ Error fetching documents:", error);
      res.status(500).json({ success: false, message: "Error fetching documents." });
  }
});


// ✅ Delete a Document by ID
router.delete("/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;
    const deletedDoc = await Document.findByIdAndDelete(documentId);

    if (!deletedDoc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    res.status(500).json({ success: false, message: "Server error while deleting document." });
  }
});

// ✅ Reassign a Document to a Different Loan Program
router.put("/:documentId/reassign", async (req, res) => {
  try {
    const { documentId } = req.params;
    const { newProgramId } = req.body;

    const updatedDoc = await Document.findByIdAndUpdate(
      documentId,
      { programId: newProgramId },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.json({ success: true, message: "Document reassigned successfully", document: updatedDoc });
  } catch (error) {
    console.error("❌ Error reassigning document:", error);
    res.status(500).json({ success: false, message: "Error reassigning document." });
  }
});

module.exports = router;
