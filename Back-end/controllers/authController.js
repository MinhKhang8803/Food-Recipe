const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
exports.register = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword, 
      phone,
      role: "user"
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Log in user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
          success: true,
          token,
          user: {
              _id: user._id,
              fullName: user.fullName,
              email: user.email,
              role: user.role,
              avatarUrl: user.avatarUrl || ''  // Trả về avatarUrl, mặc định là chuỗi rỗng nếu không có
          }
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};



// Log out user (client-side, just remove token)
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
