const User = require('../models/user');

// Assign lender to user explicitly
exports.assignLenderToUser = async (req, res) => {
  const { userId, lenderId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, { role: 'lender', lenderId });
    res.status(200).json({ success: true, message: "Lender assigned successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

  