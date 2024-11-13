import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function SocialUser() {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);  // Lưu trữ userId của người dùng hiện tại
    const backendUrl = 'http://192.168.1.7:5000';  // Replace with your actual IP and port
    const [commentText, setCommentText] = useState('');  // Bình luận người dùng nhập vào
    const [selectedComment, setSelectedComment] = useState(null);  // Bình luận đang chọn
    const [modalVisible, setModalVisible] = useState(false);  // Hiển thị modal
    const [isEditing, setIsEditing] = useState(false);  // Chế độ chỉnh sửa
    const [newCommentText, setNewCommentText] = useState('');  // Nội dung mới của bình luận


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const user = await AsyncStorage.getItem('user');
                const parsedUser = JSON.parse(user);
                setUserId(parsedUser._id);  // Lưu userId của người dùng hiện tại

                // Gọi API để lấy bài viết của những người khác
                const response = await axios.get(`${backendUrl}/api/social/posts`, {
                    params: { userId: parsedUser._id },  // Truyền userId qua query parameters
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(response.data);  // Cập nhật danh sách bài viết
            } catch (error) {
                console.error('Error fetching posts:', error);  // LOG lỗi để kiểm tra
            }
        };

        fetchPosts();  // Lấy danh sách bài đăng khi component load
    }, []);

    // Hàm Like bài viết
    const handleLikePost = async (postId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`${backendUrl}/api/posts/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPosts(posts.map(post => post._id === postId ? { ...post, likes: response.data.likes } : post));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // Hàm thêm bình luận
    const handleAddComment = async (postId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user = await AsyncStorage.getItem('user');
            const parsedUser = JSON.parse(user);

            const response = await axios.post(`${backendUrl}/api/posts/${postId}/comment`, {
                userId: parsedUser._id,
                comment: commentText,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPosts(posts.map(post => post._id === postId ? { ...post, comments: response.data.comments } : post));
                setCommentText('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleLongPressComment = (comment, postId) => {
        if (comment.userId._id === userId) {
            setSelectedComment({ ...comment, postId });
            setNewCommentText(comment.comment);
            setModalVisible(true);
        }
    };

    const handleDeleteComment = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.delete(
                `${backendUrl}/api/posts/${selectedComment.postId}/comment/${selectedComment._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { userId },
                }
            );

            if (response.status === 200) {
                setPosts(posts.map(post => post._id === selectedComment.postId ? { ...post, comments: response.data.comments } : post));
                setModalVisible(false);
                setSelectedComment(null);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditComment = async () => {
        if (!newCommentText.trim()) {
            Alert.alert('Error', 'Comment cannot be empty');
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(
                `${backendUrl}/api/posts/${selectedComment.postId}/comment/${selectedComment._id}`,
                {
                    userId,
                    newComment: newCommentText,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                setPosts(posts.map(post => post._id === selectedComment.postId ? { ...post, comments: response.data.comments } : post));
                setModalVisible(false);
                setIsEditing(false);
                setSelectedComment(null);
            }
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Social Feed</Text>

            {posts.map((post) => (
                <View key={post._id} style={styles.post}>
                    {/* Hiển thị tên tác giả ở đây */}
                    <Text style={styles.postAuthor}>{post.userId?.fullName || 'Anonymous'}</Text>

                    {/* Hiển thị nội dung bài đăng */}
                    <Text style={styles.postContent}>{post.content}</Text>

                    {/* Hiển thị ảnh nếu có */}
                    {post.image && (
                        <Image source={{ uri: post.image }} style={styles.postImage} />
                    )}

                    {/* Nút Like */}
                    <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePost(post._id)}>
                        <Text style={styles.likeButtonText}>Like ({post.likes})</Text>
                    </TouchableOpacity>

                    {/* Hiển thị bình luận */}
                    <View style={styles.commentsContainer}>
                        <Text style={styles.commentTitle}>Comments:</Text>
                        {post.comments.map((comment, index) => (
                            <TouchableOpacity key={index} onLongPress={() => handleLongPressComment(comment, post._id)}>
                                <View style={styles.commentBox}>
                                    <Text style={styles.commentUser}>
                                        {comment.userId?.fullName || 'Anonymous'}:
                                    </Text>
                                    <Text style={styles.commentText}>{comment.comment}</Text>
                                    <Text style={styles.commentDate}>
                                        {moment(comment.updatedAt || comment.createdAt).format('HH:mm DD/MM/YYYY')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Nhập bình luận */}
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Enter comment..."
                            value={commentText}
                            onChangeText={setCommentText}
                        />
                        <TouchableOpacity style={styles.commentButton} onPress={() => handleAddComment(post._id)}>
                            <Text style={styles.commentButtonText}>Comment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {/* Modal hiện tùy chọn Edit và Delete */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setIsEditing(false);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        {isEditing ? (
                            <>
                                <TextInput
                                    style={styles.editInput}
                                    value={newCommentText}
                                    onChangeText={setNewCommentText}
                                    placeholder="Edit your comment"
                                />
                                <TouchableOpacity onPress={handleEditComment} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Save</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDeleteComment} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    post: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    postAuthor: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postContent: {
        fontSize: 16,
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    likeButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    likeButtonText: {
        color: '#fff',
    },
    commentsContainer: {
        marginTop: 10,
    },
    commentTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentBox: {
        backgroundColor: '#e0e0e0',
        padding: 5,
        borderRadius: 5,
        marginBottom: 5,
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 14,
    },
    commentInputContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    commentInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    },
    commentButton: {
        backgroundColor: '#075eec',
        padding: 10,
        marginLeft: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    commentButtonText: {
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 250,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalButton: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#075eec',
    },
    editInput: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    commentDate: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
    },
});
