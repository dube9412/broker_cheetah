const mongoose = require("mongoose");
const Document = require("../models/Document");

const updateDocuments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    const documents = await Document.find({ filename: { $exists: false } });

    for (const doc of documents) {
      const fileKey = doc.filePath.split("/").pop(); // Extract the S3 object key from the filePath
      doc.filename = fileKey;
      await doc.save();
      console.log(`✅ Updated document: ${doc._id}`);
    }

    console.log("✅ All documents updated successfully.");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error updating documents:", error);
    mongoose.disconnect();
  }
};

updateDocuments();
