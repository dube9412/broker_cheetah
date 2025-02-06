const express = require("express");
const router = express.Router();
const Lender = require("../models/Lender");
const LoanProgram = require("../models/LoanProgram");

// 🟢 GET: Retrieve all lenders
router.get("/", async (req, res) => {
  try {
    const lenders = await Lender.find().populate("loanPrograms");
    res.json({ success: true, lenders });
  } catch (err) {
    console.error("Error fetching lenders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🟢 GET: Retrieve a specific lender by ID
router.get("/:lenderId", async (req, res) => {
  try {
      console.log("🔹 Fetching lender with ID:", req.params.lenderId); // Debugging
      const lender = await Lender.findById(req.params.lenderId);
      if (!lender) {
          console.error("❌ Lender not found:", req.params.lenderId);
          return res.status(404).json({ message: "Lender not found" });
      }
      console.log("✅ Found Lender:", lender);
      res.json(lender);
  } catch (error) {
      console.error("❌ Error fetching lender:", error);
      res.status(500).json({ message: "Failed to fetch lender" });
  }
});


// 🟢 POST: Create a new lender
router.post("/", async (req, res) => {
  try {
    console.log("Creating lender:", req.body);

    const newLender = new Lender({
      name: req.body.name,
      states: req.body.states || [],
      brokersLicenseOnlyStates: req.body.brokersLicenseOnlyStates || [],
      brokerFriendly: req.body.brokerFriendly || false,
      portalAddress: req.body.portalAddress || "",
      contactName: req.body.contactName || "",
      phone: req.body.phone || "",
      email: req.body.email || "",
      website: req.body.website || "",
      whiteLabelPaperwork: req.body.whiteLabelPaperwork || false,
      whiteLabelFundingTPO: req.body.whiteLabelFundingTPO || false,
      proofOfFundsLetters: req.body.proofOfFundsLetters || false,
      proofOfFundsNotes: req.body.proofOfFundsNotes || "",
      assumable: req.body.assumable || false,
      bkFcSsDil: req.body.bkFcSsDil || null,
      backgroundLimitations: req.body.backgroundLimitations || [],
      loanPrograms: [] // Initialize empty array for loan programs
    });

    await newLender.save();
    res.json({ success: true, lender: newLender });
  } catch (error) {
    console.error("Error creating lender:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔄 PUT: Update an existing lender by ID
router.put("/:id", async (req, res) => {
  try {
    console.log("Updating lender:", req.body);

    const lender = await Lender.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }

    res.json({ success: true, lender });
  } catch (err) {
    console.error("Error updating lender:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔴 DELETE: Remove a lender by ID (and delete associated loan programs)
router.delete("/:id", async (req, res) => {
  console.log("Received DELETE request for lender ID:", req.params.id);
  try {
    console.log(`Deleting lender ID: ${req.params.id}`);
    const lender = await Lender.findById(req.params.id);
    console.log("Lender found:", lender);
    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }

    // Delete associated loan programs
    await LoanProgram.deleteMany({ lenderId: lender._id });

    // Delete lender
    await Lender.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Lender and associated loan programs deleted" });
  } catch (err) {
    console.error("Error deleting lender:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📌 LOAN PROGRAM MANAGEMENT (Handles loan programs within the lender route)

// 🟢 GET: Retrieve all loan programs for a lender
router.get("/:id", async (req, res) => {
  try {
      const lender = await Lender.findById(req.params.id);
      if (!lender) {
          console.error("❌ Lender not found:", req.params.id);
          return res.status(404).json({ message: "Lender not found" });
      }
      console.log("✅ Found Lender:", lender);
      res.json({ success: true, lender }); // 🛑 This response format causes issues!
  } catch (error) {
      console.error("❌ Error fetching lender:", error);
      res.status(500).json({ message: "Failed to fetch lender" });
  }
});


// 🟢 POST: Add a loan program to a lender
router.post("/:id/loan-programs", async (req, res) => {
  try {
    const { name, tiers } = req.body;
    const lender = await Lender.findById(req.params.id);
    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }

    const newLoanProgram = new LoanProgram({ lenderId: lender._id, name, tiers });
    await newLoanProgram.save();

    lender.loanPrograms.push(newLoanProgram._id);
    await lender.save();

    res.json({ success: true, loanProgram: newLoanProgram });
  } catch (error) {
    console.error("Error adding loan program:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔄 PUT: Update an existing loan program
router.put("/:id/loan-programs/:programId", async (req, res) => {
  try {
    const { name, tiers } = req.body;
    const loanProgram = await LoanProgram.findByIdAndUpdate(
      req.params.programId,
      { name, tiers },
      { new: true }
    );

    if (!loanProgram) {
      return res.status(404).json({ success: false, message: "Loan program not found" });
    }

    res.json({ success: true, loanProgram });
  } catch (error) {
    console.error("Error updating loan program:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔴 DELETE: Remove a loan program from a lender
router.delete("/:id/loan-programs/:programId", async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.id);
    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }

    await LoanProgram.findByIdAndDelete(req.params.programId);
    lender.loanPrograms = lender.loanPrograms.filter((program) => program.toString() !== req.params.programId);
    await lender.save();

    res.json({ success: true, message: "Loan program deleted" });
  } catch (error) {
    console.error("Error deleting loan program:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
