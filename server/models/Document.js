const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  originalName: String,
  customName: String,
  filePath: String,
  loanPrograms: [String],
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Document', DocumentSchema);
