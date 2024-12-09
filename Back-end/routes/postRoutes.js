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
const router = express.Router();

router.get('/social/posts', (req, res, next) => {
    const { userId } = req.query;  
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    next();  
}, getAllPosts);

router.post('/create', createPost);

router.get('/:userId/posts', getPosts);

router.delete('/:postId', deletePost);

router.post('/:postId/like', likePost);

router.post('/:postId/comment', addComment);

router.delete('/:postId/comment/:commentId', deleteComment);
router.put('/:postId/comment/:commentId', editComment);

module.exports = router;
