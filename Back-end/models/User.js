const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: "user" },
  avatarUrl: { type: String, default: '' },
  banStatus: {
    isBanned: { type: Boolean, default: false },
    reason: { type: String },
    banDuration: { type: String },
    banStartDate: { type: Date },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
