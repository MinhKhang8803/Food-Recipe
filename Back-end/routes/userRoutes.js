const express = require('express');
const { getUserProfile, updateAvatar, searchUsers, banUser, reportPost, getReports, deletePostAndReport, dismissReport } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', authMiddleware, getUserProfile);
router.put('/update-avatar', authMiddleware, updateAvatar);
router.get('/search', authMiddleware, searchUsers);
router.post('/ban-user', banUser);
router.post('/posts/report', authMiddleware, reportPost);
router.get('/reports', authMiddleware, getReports);
router.delete('/reports/:reportId/post/:postId', authMiddleware, deletePostAndReport);
router.delete('/reports/:reportId', authMiddleware, dismissReport);

module.exports = router;