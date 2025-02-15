const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'superadmin', 'lender'], default: 'user' },  // ✅ Role-based access
  createdAt: { type: Date,  default: Date.now }
});

module.exports = mongoose.model('User', userSchema);