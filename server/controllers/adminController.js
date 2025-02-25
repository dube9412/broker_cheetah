const LenderUser = require("../models/LenderUser");

// ✅ Assign a lender to a lender user
exports.assignLenderToUser = async (req, res) => {
  const { userId, lenderId } = req.body;

  try {
    const lenderUser = await LenderUser.findById(userId);
    if (!lenderUser) {
      return res.status(404).json({ message: "Lender user not found." });
    }

    lenderUser.lenderId = lenderId; // ✅ Assign the lender ID
    await lenderUser.save();

    res.status(200).json({ success: true, message: "Lender assigned successfully." });
  } catch (error) {
    console.error("❌ Error assigning lender:", error);
    res.status(500).json({ success: false, message: "Failed to assign lender." });
  }
};


  