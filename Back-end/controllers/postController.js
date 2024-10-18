// controllers/postController.js
const Post = require('../models/Post');

// Create a post with an image
exports.createPost = async (req, res) => {
    const { userId, content, image } = req.body;

    try {
        const post = new Post({ userId, content, image });
        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Fetch posts for a specific user
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId }).populate('userId', 'fullName avatarUrl');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};