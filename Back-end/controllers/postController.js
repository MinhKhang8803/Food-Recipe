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

// Delete a post
exports.deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        console.log('Post ID to delete:', postId);  // LOG kiểm tra ID bài viết cần xóa
        const post = await Post.findById(postId);
        
        if (!post) {
            console.log('Post not found');  // LOG nếu không tìm thấy bài viết
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('Deleting post...');  // LOG trước khi xóa bài viết
        await Post.findByIdAndDelete(postId);  // Sử dụng phương thức findByIdAndDelete để xóa bài viết
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error during deletion:', error);  // LOG lỗi chi tiết
        res.status(500).json({ message: 'Server error', error });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.likes += 1;  // Tăng số lượng Like lên 1
        await post.save();

        res.status(200).json({ message: 'Post liked successfully', likes: post.likes });
    } catch (error) {
        console.error('Error during liking post:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            userId,
            comment,
        };

        post.comments.push(newComment);  // Thêm bình luận vào mảng
        await post.save();

        res.status(200).json({ message: 'Comment added successfully', comments: post.comments });
    } catch (error) {
        console.error('Error during adding comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};