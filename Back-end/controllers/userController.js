// controllers/userController.js
const User = require('../models/User');  // Declare User model only once at the top

// Update the avatar URL for the user
// Update avatar URL
// Update avatar URL
exports.updateAvatar = async (req, res) => {
    const { avatarUrl } = req.body;

    try {
        const user = await User.findById(req.user.userId);  // Lấy thông tin user từ token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật URL avatar mới
        user.avatarUrl = avatarUrl;  
        await user.save();  // Lưu thay đổi vào MongoDB

        return res.status(200).json({ message: 'Avatar updated successfully', avatarUrl: user.avatarUrl });
    } catch (error) {
        console.error('Error updating avatar:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Fetch logged-in user profile
exports.getUserProfile = async (req, res) => {
    try {
        console.log('Fetching user with ID:', req.user.id);

        const user = await User.findById(req.user.id).select('fullName email avatarUrl');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
