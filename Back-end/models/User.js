const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: "user" },
  avatarUrl: { type: String, default: '' },  // Thêm trường avatarUrl với giá trị mặc định là chuỗi rỗng
});

// Hash password before saving only if it has not been hashed already
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Check if the password is already hashed by checking if it starts with $2a$ or $2b$
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next(); 
  }

  // Otherwise, hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);