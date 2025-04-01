const express = require("express");
const router = express.Router();
const multer = require("multer");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Document = require("../models/Document");

// ✅ Configure AWS S3 Client
console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID ? "Loaded" : "Not Loaded");
console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "Loaded" : "Not Loaded");
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME); // Correct variable name
 // Correct variable name
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Multer Storage Config
const storage = multer.memoryStorage(); // Store files in memory temporarily
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

    const fileKey = `${Date.now()}-${req.file.originalname}`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    // ✅ Upload to S3
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });
    await upload.done();

    const newDocument = new Document({
      filename: fileKey, // ✅ Save the S3 object key
      originalName: req.file.originalname,
      filePath: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`, // S3 URL
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

// ✅ Bulk Upload Multiple Documents
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded." });
    }

    const { lenderId, programId, tag } = req.body;

    if (!lenderId || !tag) {
      return res.status(400).json({ success: false, message: "Lender ID and Tag are required." });
    }

    const uploadedDocs = [];

    for (const file of req.files) {
      const fileKey = `${Date.now()}-${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        uploadedDocs.push({
          filename: fileKey, // ✅ Save the S3 object key
          originalName: file.originalname,
          filePath: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`, // S3 URL
          lenderId,
          programId: programId || null,
          tag,
        });
      } catch (uploadError) {
        console.error(`❌ Error uploading file ${file.originalname}:`, uploadError);
        return res.status(500).json({ success: false, message: `Error uploading file: ${file.originalname}` });
      }
    }

    await Document.insertMany(uploadedDocs);
    res.status(201).json({ success: true, message: "Bulk documents uploaded successfully!", documents: uploadedDocs });
  } catch (error) {
    console.error("❌ Error in bulk upload:", error);
    res.status(500).json({ success: false, message: "Error in bulk document upload." });
  }
});

// ✅ Serve Uploaded Files
router.get("/view/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId);

    if (!document) {
      console.error("❌ Error: Document not found:", documentId);
      return res.status(404).json({ success: false, message: "Document not found." });
    }

    if (!document.filename) {
      console.error("❌ Error: Document filename is missing:", document);
      return res.status(400).json({ success: false, message: "Document filename is missing." });
    }

    const fileKey = document.filename; // S3 key
    const bucketName = process.env.AWS_BUCKET_NAME;

    console.log("🔹 Generating signed URL for:", { bucketName, fileKey });

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    // Generate a signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.redirect(signedUrl); // Redirect the user to the signed URL
  } catch (error) {
    console.error("❌ Error generating signed URL:", error);
    res.status(500).json({ success: false, message: "Error generating signed URL." });
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

// ✅ Fetch ALL Documents (Admin Only)
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find({});
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error("❌ Error fetching all documents:", error);
    res.status(500).json({ success: false, message: "Error fetching all documents." });
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

// ✅ Reassign a Document to a Different Loan Program (or Remove from a Program)
router.put("/:documentId/reassign", async (req, res) => {
  try {
    const { documentId } = req.params;
    const { newProgramId } = req.body;

    // ✅ If newProgramId is null, remove it from a loan program (Lender-Wide)
    const updatedDoc = await Document.findByIdAndUpdate(
      documentId,
      { programId: newProgramId || null },
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

router.put("/:documentId/assign-tag", async (req, res) => {
  try {
    const { documentId } = req.params;
    const { newTag } = req.body;

    const updatedDoc = await Document.findByIdAndUpdate(
      documentId,
      { tag: newTag },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.json({ success: true, message: "Tag assigned successfully", document: updatedDoc });
  } catch (error) {
    console.error("❌ Error assigning tag:", error);
    res.status(500).json({ success: false, message: "Error assigning tag." });
  }
});

module.exports = router;
