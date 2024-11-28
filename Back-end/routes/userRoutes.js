// routes/userRoutes.js
const express = require('express');
const { getUserProfile, updateAvatar } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', authMiddleware, getUserProfile);
router.put('/update-avatar', authMiddleware, updateAvatar);

router.post('/ban', async (req, res) => {
    const { email, reason, banDuration } = req.body;

    if (!email || !reason || !banDuration) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.banStatus = {
            isBanned: true,
            reason,
            banDuration,
            banStartDate: new Date(),
        };
        await user.save();

        res.status(200).json({ message: `User ${email} banned successfully.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
