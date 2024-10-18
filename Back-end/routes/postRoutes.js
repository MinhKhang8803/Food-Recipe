// routes/postRoutes.js
const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');  // Import getPosts
const router = express.Router();

router.post('/create', createPost);
router.get('/:userId/posts', getPosts);  // Route for fetching posts for a specific user

module.exports = router;

// router.get('/:userId/posts/:postId', getPost);  // Add this route for fetching a specific post for a specific user
