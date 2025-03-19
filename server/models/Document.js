const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  customName: { type: String, default: "" },
  filePath: { type: String, required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lender', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanProgram', default: null }, // ✅ Nullable
  tag: { type: String, required: true }, // ✅ Ensure Tag is Saved
  uploadedAt: { type: Date, default: Date.now },
  //uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});


module.exports = mongoose.model('Document', DocumentSchema);
