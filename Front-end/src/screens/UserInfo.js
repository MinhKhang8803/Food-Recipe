import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';  // Import thư viện image-picker để chọn ảnh
import { storage } from '../../firebase';  // Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Import các hàm từ firebase/storage

export default function UserInfo() {
    const [userData, setUserData] = useState({ fullName: '', avatarUrl: '', email: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [imageUri, setImageUri] = useState(null);  // Lưu URI của ảnh được chọn
    const [posts, setPosts] = useState([]);  // Danh sách bài viết
    const [commentText, setCommentText] = useState('');  // Bình luận người dùng nhập vào
    const navigation = useNavigation();
    const backendUrl = 'http://192.168.1.10:5000';  // Backend URL

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('user');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchPosts = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${backendUrl}/api/posts/${userData._id}/posts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(response.data);  // Cập nhật danh sách bài viết
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchUserData();
        fetchPosts();  // Lấy danh sách bài viết khi component load
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
            console.log('Deleting post with ID:', postId);  // LOG kiểm tra postId

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

                {/* Hiển thị danh sách bài viết */}
                <View style={styles.postsContainer}>
                    {posts.map((post) => (
                        <View key={post._id} style={styles.post}>
                            <Text style={styles.postContent}>{post.content}</Text>
                            {post.image && (
                                <Image source={{ uri: post.image }} style={styles.postImage} />
                            )}

                            {/* Nút Like */}
                            <View style={styles.postActions}>
                                <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePost(post._id)}>
                                    <Text style={styles.likeButtonText}>Like ({post.likes})</Text>
                                </TouchableOpacity>

                                {/* Nút xóa bài viết */}
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(post._id)}>
                                    <Text style={styles.deleteButtonText}>Delete Post</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Modal tạo bài viết */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <View style={styles.modalView}>
                                    <TextInput
                                        style={styles.postInput}
                                        placeholder="Viết bài viết..."
                                        multiline
                                        value={postContent}
                                        onChangeText={setPostContent}
                                    />

                                    {/* Hiển thị ảnh được chọn nếu có */}
                                    {imageUri && (
                                        <Image source={{ uri: imageUri }} style={styles.previewImage} />
                                    )}

                                    {/* Nút chọn ảnh */}
                                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                                        <Text style={styles.imageButtonText}>Choose Picture</Text>
                                    </TouchableOpacity>

                                    {/* Nút đăng bài */}
                                    <TouchableOpacity style={styles.postButton} onPress={handlePostSubmit}>
                                        <Text style={styles.postButtonText}>Post</Text>
                                    </TouchableOpacity>

                                    {/* Nút hủy */}
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                            {/* Hiển thị bình luận */}
                            <View style={styles.commentsContainer}>
                                {post.comments.map((comment, index) => (
                                    <Text key={index} style={styles.commentText}>
                                        {comment.comment}
                                    </Text>
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
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
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
    },
    imageButton: {
        backgroundColor: '#f64e32',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    imageButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    postButton: {
        backgroundColor: '#f64e32',
        padding: 10,
        borderRadius: 10,
    },
    postButtonText: {
        color: 'white',
        fontSize: 18,
    },
    cancelButton: {
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#075eec',
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
});
