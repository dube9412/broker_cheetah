const mongoose = require("mongoose");

const HelpTicketSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  issue: { type: String, required: true },
  status: { type: String, default: "Open" },
  createdAt: { type: Date, default: Date.now },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", default: null }
});

module.exports = mongoose.model("HelpTicket", HelpTicketSchema);
