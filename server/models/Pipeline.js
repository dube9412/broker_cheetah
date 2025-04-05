const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  name: String,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  updatedAt: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema({
  name: String,
  status: { type: String, enum: ["pending", "submitted"], default: "pending" },
  fileUrl: String, // Optional: URL for uploaded files
});

const contactSchema = new mongoose.Schema({
  role: String, // e.g., "borrower", "lender", "title company"
  name: String,
  email: String,
  phone: String,
});

const pipelineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: String,
  fico: Number,
  experience: Number,
  purchasePrice: Number,
  asisValue: Number,
  rehabNeeded: Number,
  arv: Number,
  liquidity: Number,
  milestones: [milestoneSchema],
  documents: [documentSchema],
  contacts: [contactSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pipeline", pipelineSchema);
