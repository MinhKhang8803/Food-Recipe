// routes/postRoutes.js
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

// Route để lấy tất cả bài đăng từ bảng posts, nhưng loại trừ bài đăng của người dùng hiện tại
router.get('/social/posts', (req, res, next) => {
    const { userId } = req.query;  // Lấy userId từ query parameters
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    next();  // Tiếp tục với controller getAllPosts
}, getAllPosts);

// Route tạo bài viết
router.post('/create', createPost);

// Route lấy bài viết của người dùng cụ thể
router.get('/:userId/posts', getPosts);

// Route xóa bài viết
router.delete('/:postId', deletePost);

// Route like bài viết
router.post('/:postId/like', likePost);

// Route thêm bình luận
router.post('/:postId/comment', addComment);

// Routes cho xóa và chỉnh sửa bình luận
router.delete('/:postId/comment/:commentId', deleteComment);
router.put('/:postId/comment/:commentId', editComment);

module.exports = router;
