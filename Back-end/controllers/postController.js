const Post = require('../models/Post');
const User = require('../models/User');  

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

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
            .populate('userId', 'fullName avatarUrl') 
            .populate('comments.userId', 'fullName'); 

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

exports.deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        console.log('Post ID to delete:', postId);  
        const post = await Post.findById(postId);
        
        if (!post) {
            console.log('Post not found'); 
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('Deleting post...'); 
        await Post.findByIdAndDelete(postId); 
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error during deletion:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.likePost = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.likes += 1;  
        await post.save();

        res.status(200).json({ message: 'Post liked successfully', likes: post.likes });
    } catch (error) {
        console.error('Error during liking post:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const user = await User.findById(userId).select('fullName');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newComment = {
            userId,
            comment,
            createdAt: new Date(),  
        };

        post.comments.push(newComment);
        await post.save();

        await post.populate('comments.userId', 'fullName');

        res.status(200).json({ message: 'Comment added successfully', comments: post.comments });
    } catch (error) {
        console.error('Error during adding comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const commentIndex = post.comments.findIndex(
            (comment) => comment._id.toString() === commentId && comment.userId.toString() === userId
        );

        if (commentIndex === -1) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        post.comments.splice(commentIndex, 1); 
        await post.save();

        await post.populate('comments.userId', 'fullName');

        res.status(200).json({ message: 'Comment deleted successfully', comments: post.comments });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Chỉnh sửa bình luận
exports.editComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { userId, newComment } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Tìm bình luận và cập nhật nội dung và thời gian cập nhật
        const comment = post.comments.find(
            (comment) => comment._id.toString() === commentId && comment.userId.toString() === userId
        );

        if (!comment) {
            return res.status(403).json({ message: 'Unauthorized to edit this comment' });
        }

        comment.comment = newComment;  // Cập nhật nội dung bình luận
        comment.updatedAt = new Date();  // Cập nhật thời gian chỉnh sửa
        await post.save();

        // Populate lại bình luận để có đầy đủ thông tin người dùng và thời gian
        await post.populate('comments.userId', 'fullName');

        res.status(200).json({ message: 'Comment edited successfully', comments: post.comments });
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Lấy tất cả bài đăng (dành cho trang Social)
exports.getAllPosts = async (req, res) => {
    const { userId } = req.query;

    try {
        // Lấy tất cả bài viết, loại trừ bài của người dùng hiện tại
        const posts = await Post.find({ userId: { $ne: userId } })
            .populate('userId', 'fullName avatarUrl')
            .populate('comments.userId', 'fullName');  // Đảm bảo comments bao gồm fullName và createdAt

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};