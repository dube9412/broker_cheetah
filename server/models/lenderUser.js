const mongoose = require("mongoose");

const lenderUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    role: { type: String, default: "lender" },
    approved: { type: Boolean, default: false },
    lenderId: { type: String, default: null }, // Or ObjectId if referencing Lenders
    suspended: { type: Boolean, default: false }, // ADD THIS
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LenderUser", lenderUserSchema);
