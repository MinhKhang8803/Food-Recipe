// routes/postRoutes.js
const express = require('express');
const { createPost, getPosts, deletePost, likePost, addComment } = require('../controllers/postController');  
const router = express.Router();

router.post('/create', createPost);
router.get('/:userId/posts', getPosts);  // Route for fetching posts for a specific user
router.delete('/:postId', deletePost);  // Route for deleting a specific post

// Routes cho Like và Comment
router.post('/:postId/like', likePost);  // Route để like bài viết
router.post('/:postId/comment', addComment);  // Route để bình luận

module.exports = router;



// router.get('/:userId/posts/:postId', getPost);  // Add this route for fetching a specific post for a specific user
