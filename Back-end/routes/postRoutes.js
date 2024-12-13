const express = require('express');
const {
    createPost,
    getPosts,
    deletePost,
    likePost,
    addComment,
    getAllPosts,
    deleteComment,
    editComment
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/social/posts', (req, res, next) => {
    const { userId } = req.query;  
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    next();  
}, getAllPosts);

router.post('/create', authMiddleware, createPost);

router.get('/:userId/posts', authMiddleware, getPosts);

router.delete('/:postId', authMiddleware, deletePost);

router.post('/:postId/like', authMiddleware, likePost);

router.post('/:postId/comment', authMiddleware, addComment);

router.delete('/:postId/comment/:commentId', authMiddleware, deleteComment);

router.put('/:postId/comment/:commentId', authMiddleware, editComment);

module.exports = router;
