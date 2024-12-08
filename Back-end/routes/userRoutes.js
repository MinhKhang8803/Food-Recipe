const express = require('express');
const { getUserProfile, updateAvatar, searchUsers, banUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', authMiddleware, getUserProfile);
router.put('/update-avatar', authMiddleware, updateAvatar);
router.get('/search', authMiddleware, searchUsers);
router.post('/ban-user', authMiddleware, banUser);

module.exports = router;