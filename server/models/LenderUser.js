const mongoose = require("mongoose");

const lenderUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    role: { type: String, default: "lender" },
    approved: { type: Boolean, default: false },
    lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lender', default: null }, // Reference to assigned lender
    suspended: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: null }
});

module.exports = mongoose.model("LenderUser", lenderUserSchema);