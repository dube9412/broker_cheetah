const User = require("../models/user");
const Lender = require("../models/Lender");

// ✅ Assign a lender to a user
exports.assignLenderToUser = async (req, res) => {
  try {
    const { userId, lenderId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const lender = await Lender.findById(lenderId);
    if (!lender) return res.status(404).json({ message: "Lender not found" });

    user.lenderId = lenderId;
    await user.save();

    res.status(200).json({ success: true, message: "Lender assigned to user successfully" });
  } catch (error) {
    console.error("❌ Error assigning lender to user:", error);
    res.status(500).json({ message: "Failed to assign lender to user" });
  }
};


