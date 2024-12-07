import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';  // Import thư viện image-picker để chọn ảnh
import { storage } from '../../firebase';  // Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Import các hàm từ firebase/storage
import moment from 'moment';

export default function UserScreen() {
    const [userData, setUserData] = useState({ fullName: '', avatarUrl: '', email: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [imageUri, setImageUri] = useState(null);  // Lưu URI của ảnh được chọn
    const [posts, setPosts] = useState([]);  // Danh sách bài viết
    const [commentText, setCommentText] = useState('');  // Bình luận người dùng nhập vào
    const navigation = useNavigation();
    const backendUrl = 'http://192.168.1.6:5000';  // Backend URL
    const [userId, setUserId] = useState(null);  // ID của người dùng hiện tại
    const [selectedComment, setSelectedComment] = useState(null);  // Bình luận được chọn
    const [isEditing, setIsEditing] = useState(false);  // Chế độ chỉnh sửa
    const [newCommentText, setNewCommentText] = useState('');  // Nội dung mới của bình luận
    const [postModalVisible, setPostModalVisible] = useState(false);  // Hiển thị Modal đăng bài
    const [commentModalVisible, setCommentModalVisible] = useState(false);  // Hiển thị Modal bình luận


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('user');
                if (storedUserData) {
                    const parsedUserData = JSON.parse(storedUserData);
                    setUserData(parsedUserData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();  // Gọi hàm lấy dữ liệu người dùng khi component load
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!userData._id) {
                return;  // Nếu userData._id chưa được gán, không gọi API lấy bài viết
            }
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${backendUrl}/api/posts/${userData._id}/posts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(response.data);  // Cập nhật danh sách bài viết
            } catch (error) {
                console.error('Error fetching posts:', error);  // LOG lỗi để kiểm tra
            }
        };

        fetchPosts();  // Gọi hàm lấy danh sách bài viết mỗi khi userData._id thay đổi
    }, [userData._id]);

    // Chọn ảnh từ thư viện và tải lên Firebase
    const pickImage = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("Permission to access camera roll is required!");
                return;
            }

            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                base64: false,  // Chỉ lấy URI file, không cần base64
            });

            if (!pickerResult.canceled && pickerResult.assets.length > 0) {
                const selectedImage = pickerResult.assets[0].uri;  // Lấy URI ảnh
                setImageUri(selectedImage);  // Cập nhật state cho ảnh
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick an image.');
        }
    };

    // Upload ảnh lên Firebase và nhận URL ảnh
    const uploadImageToFirebase = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `image_posts/${userData.email}_${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    // Submit bài viết và ảnh lên backend
const handlePostSubmit = async () => {
    // Kiểm tra nếu người dùng không nhập nội dung và không chọn ảnh
    if (!postContent.trim() && !imageUri) {
        Alert.alert('Error', 'Users need to enter complete post information');
        return;  // Dừng lại nếu không có thông tin đầy đủ
    }

    try {
        const token = await AsyncStorage.getItem('token');
        let imageUrl = '';

        // Nếu người dùng đã chọn ảnh, tải ảnh lên Firebase
        if (imageUri) {
            imageUrl = await uploadImageToFirebase(imageUri);
        }

        const postData = {
            userId: userData._id,
            content: postContent,
            image: imageUrl,  // Lưu URL của ảnh từ Firebase
        };

        const response = await axios.post(`${backendUrl}/api/posts/create`, postData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
            Alert.alert('Success', 'Post created successfully');
            setPostContent('');  // Clear input
            setImageUri(null);  // Clear selected image
            setModalVisible(false);  // Close modal
            setPosts([...posts, response.data.post]);  // Cập nhật danh sách bài viết
        }
    } catch (error) {
        console.error('Error creating post:', error);
        Alert.alert('Error', 'Failed to create post.');
    }
};

    // Hàm xóa bài viết
    const handleDeletePost = async (postId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.delete(`${backendUrl}/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Post deleted successfully');
                setPosts(posts.filter(post => post._id !== postId));  // Xóa bài viết khỏi danh sách
            }
        } catch (error) {
            console.error('Error deleting post:', error);  // LOG lỗi
            Alert.alert('Error', 'Failed to delete post.');
        }
    };

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
            Alert.alert('Error', 'Failed to like post.');
        }
    };

    // Hàm thêm bình luận
    const handleAddComment = async (postId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`${backendUrl}/api/posts/${postId}/comment`, {
                userId: userData._id,
                comment: commentText,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPosts(posts.map(post => post._id === postId ? { ...post, comments: response.data.comments } : post));
                setCommentText('');  // Clear comment input
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment.');
        }
    };

    // Hàm xử lý nhấn giữ bình luận
    const handleLongPressComment = (comment, postId) => {
        if (comment.userId._id === userData._id) {  // Kiểm tra nếu bình luận là của người dùng hiện tại
            console.log('Long press detected on user comment:', comment.comment); // LOG kiểm tra
            setSelectedComment({ ...comment, postId });
            setNewCommentText(comment.comment);  // Thiết lập nội dung ban đầu khi chỉnh sửa
            setCommentModalVisible(true);  // Hiển thị Modal cho bình luận
        }
    };

    // Hàm xử lý xóa bình luận
    const handleDeleteComment = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
            const response = await axios.delete(
                `${backendUrl}/api/posts/${selectedComment.postId}/comment/${selectedComment._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }, // Gửi token xác thực
                    data: { userId: userData._id }, // Gửi ID người dùng trong body request
                }
            );

            if (response.status === 200) {
                // Cập nhật danh sách bình luận sau khi xóa thành công
                setPosts(posts.map(post =>
                    post._id === selectedComment.postId
                        ? { ...post, comments: response.data.comments }
                        : post
                ));
                setCommentModalVisible(false); // Đóng modal
                setSelectedComment(null); // Clear bình luận đang chọn
                Alert.alert('Success', 'Comment deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting comment:', error); // Log lỗi để debug
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete comment.');
        }
    };


    // Hàm xử lý chỉnh sửa bình luận
    const handleEditComment = async () => {
        if (!newCommentText.trim()) {
            Alert.alert('Error', 'Comment cannot be empty');
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
            const response = await axios.put(
                `${backendUrl}/api/posts/${selectedComment.postId}/comment/${selectedComment._id}`,
                {
                    userId: userData._id, // Gửi đúng ID người dùng hiện tại
                    newComment: newCommentText, // Nội dung mới của bình luận
                },
                {
                    headers: { Authorization: `Bearer ${token}` }, // Đính kèm token xác thực
                }
            );

            if (response.status === 200) {
                // Cập nhật danh sách bình luận sau khi chỉnh sửa thành công
                setPosts(posts.map(post =>
                    post._id === selectedComment.postId
                        ? { ...post, comments: response.data.comments }
                        : post
                ));
                setCommentModalVisible(false); // Đóng modal
                setIsEditing(false); // Thoát chế độ chỉnh sửa
                setSelectedComment(null); // Clear bình luận đang chọn
            }
        } catch (error) {
            console.error('Error editing comment:', error); // LOG lỗi
            Alert.alert('Error', error.response?.data?.message || 'Failed to edit comment.'); // Hiển thị thông báo lỗi
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Image
                        source={userData.avatarUrl ? { uri: userData.avatarUrl } : require('../../assets/images/default-avatar.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{userData.fullName}</Text>
                </View>

                {/* Nút tạo bài viết */}
                <View style={styles.createPostContainer}>
                    <TouchableOpacity style={styles.createPostButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.createPostText}>Create Post</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal tạo bài viết */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <TextInput
                                style={styles.postInput}
                                value={postContent}
                                onChangeText={setPostContent}
                                placeholder="Enter your post content"
                                multiline={true}
                            />

                            {imageUri && (
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.previewImage}
                                />
                            )}

                            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                                <Text style={styles.imageButtonText}>Pick an Image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.postButton} onPress={handlePostSubmit}>
                                <Text style={styles.postButtonText}>Submit Post</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal chỉnh sửa bình luận */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={commentModalVisible}
                    onRequestClose={() => setCommentModalVisible(false)}
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
                                    <TouchableOpacity onPress={() => setCommentModalVisible(false)} style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>


                {/* Hiển thị danh sách bài viết */}
                <View style={styles.postsContainer}>
                    {posts.map((post) => (
                        <View key={post._id} style={styles.post}>
                            {/* Hiển thị tên người đăng và thời gian đăng bài */}
                            <Text style={styles.postAuthor}>
                                {post.userId?.fullName || 'Anonymous'}
                            </Text>
                            <Text style={styles.postDate}>
                                {post.createdAt ? moment(post.createdAt).format('HH:mm DD/MM/YYYY') : ''}
                            </Text>

                            {/* Hiển thị nội dung và hình ảnh bài viết */}
                            <Text style={styles.postContent}>{post.content}</Text>
                            {post.image && (
                                <Image source={{ uri: post.image }} style={styles.postImage} />
                            )}

                            {/* Nút Like và Xóa bài viết */}
                            <View style={styles.postActions}>
                                <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePost(post._id)}>
                                    <Text style={styles.likeButtonText}>Like ({post.likes})</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(post._id)}>
                                    <Text style={styles.deleteButtonText}>Delete Post</Text>
                                </TouchableOpacity>
                            </View>

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
                </View>
                {/* Modal hiện tùy chọn Edit và Delete */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={commentModalVisible}
                    onRequestClose={() => {
                        setCommentModalVisible(false);
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
                                    <TouchableOpacity onPress={() => setCommentModalVisible(false)} style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 50,
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#f64e32',
        padding: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: hp(3),
        fontWeight: '700',
        color: '#fff',
    },
    createPostContainer: {
        padding: 20,
        alignItems: 'center',
    },
    createPostButton: {
        backgroundColor: '#075eec',
        padding: 15,
        borderRadius: 10,
    },
    createPostText: {
        color: '#fff',
        fontSize: hp(2.2),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',  // Background tối
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    postInput: {
        height: 100,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
    },
    previewImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 15,
        borderRadius: 10,
    },
    imageButton: {
        backgroundColor: '#f64e32',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    imageButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    postButton: {
        backgroundColor: '#075eec',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    postButtonText: {
        color: 'white',
        fontSize: 18,
    },
    cancelButton: {
        backgroundColor: '#ff4444',
        padding: 10,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    postsContainer: {
        paddingVertical: 20,
    },
    post: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    postContent: {
        fontSize: hp(2),
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    likeButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 10,
    },
    likeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        padding: 10,
        borderRadius: 10,
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    commentsContainer: {
        marginTop: 10,
    },
    commentText: {
        backgroundColor: '#e0e0e0',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
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
    },
    commentButtonText: {
        color: '#fff',
    },
    postAuthor: {
        fontSize: hp(2.2),
        fontWeight: 'bold',
        marginBottom: 3,
    },
    postDate: {
        fontSize: hp(1.8),
        color: 'gray',
        marginBottom: 10,
    },
    commentTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentBox: {
        backgroundColor: '#e0e0e0',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentDate: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
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
});
