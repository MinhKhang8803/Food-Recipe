// routes/userRoutes.js
const express = require('express');
const { getUserProfile, updateAvatar } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', authMiddleware, getUserProfile);
router.put('/update-avatar', authMiddleware, updateAvatar);

module.exports = router;
