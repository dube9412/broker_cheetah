const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");  // ✅ Import path module
const fs = require("fs");      // ✅ Import fs module
const Document = require("../models/Document"); // ✅ Ensure this model exists

/// ✅ Ensure "uploads/" directory exists
const uploadPath = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // ✅ Save files in /uploads/
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
    if (!lenderId || !tag) {
      return res.status(400).json({ success: false, message: "Lender ID and Tag are required." });
    }

    const newDocument = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`, // ✅ Relative Path
      lenderId,
      programId: programId || null,
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
router.get("/view/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found." });
    }

    const filePath = path.join(__dirname, "../../", document.filePath);
    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found on server:", filePath);
      return res.status(404).json({ success: false, message: "File not found on server." });
    }

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
