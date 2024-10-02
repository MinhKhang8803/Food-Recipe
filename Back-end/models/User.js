const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
});

// Hash password before saving only if it has not been hashed already
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Check if the password is already hashed by checking if it starts with $2a$ or $2b$
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next(); // Skip re-hashing if it's already hashed
  }

  // Otherwise, hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
