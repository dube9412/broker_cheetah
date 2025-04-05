const mongoose = require("mongoose");

const HelpTicketSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  issue: { type: String, required: true },
  desiredOutcome: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HelpTicket", HelpTicketSchema);
