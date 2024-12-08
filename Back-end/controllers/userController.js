const User = require('../models/User');  
const BanUser = require('../models/Ban');

exports.updateAvatar = async (req, res) => {
    const { avatarUrl } = req.body;

    try {
        const user = await User.findById(req.user.userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.avatarUrl = avatarUrl;  
        await user.save(); 

        return res.status(200).json({ message: 'Avatar updated successfully', avatarUrl: user.avatarUrl });
    } catch (error) {
        console.error('Error updating avatar:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

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

exports.banUser = async (req, res) => {
    const { email, reason, banDuration } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingBan = await Ban.findOne({ email });
        if (existingBan) {
            return res.status(400).json({ message: 'User is already banned' });
        }

        const newBan = new Ban({
            email,
            reason,
            banDuration,
        });

        await newBan.save();

        return res.status(200).json({ message: 'User banned successfully', ban: newBan });
    } catch (error) {
        console.error('Error banning user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};