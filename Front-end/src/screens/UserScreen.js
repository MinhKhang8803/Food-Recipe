import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';  
import { storage } from '../../firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';  
import moment from 'moment';

export default function UserScreen() {
    const [userData, setUserData] = useState({ fullName: '', avatarUrl: '', email: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [imageUri, setImageUri] = useState(null);  
    const [posts, setPosts] = useState([]); 
    const [commentText, setCommentText] = useState(''); 
    const navigation = useNavigation();
    const backendUrl = 'https://food-recipe-k8jh.onrender.com';  
    const [userId, setUserId] = useState(null);  
    const [selectedComment, setSelectedComment] = useState(null); 
    const [isEditing, setIsEditing] = useState(false);  
    const [newCommentText, setNewCommentText] = useState(''); 
    const [postModalVisible, setPostModalVisible] = useState(false);  
    const [commentModalVisible, setCommentModalVisible] = useState(false); 


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

        fetchUserData();  
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!userData._id) {
                return; 
            }
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${backendUrl}/api/posts/${userData._id}/posts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(response.data);  
            } catch (error) {
                console.error('Error fetching posts:', error);  
            }
        };

        fetchPosts();  
    }, [userData._id]);

    const pickImage = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("Permission to access camera roll is required!");
                return;
            }

            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                base64: false, 
            });

            if (!pickerResult.canceled && pickerResult.assets.length > 0) {
                const selectedImage = pickerResult.assets[0].uri; 
                setImageUri(selectedImage); 
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick an image.');
        }
    };

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

    const handlePostSubmit = async () => {
        if (!postContent.trim() && !imageUri) {
            Alert.alert('Error', 'Users need to enter complete post information');
            return; 
        }

        try {
            const token = await AsyncStorage.getItem('token');
            let imageUrl = '';

            if (imageUri) {
                imageUrl = await uploadImageToFirebase(imageUri);
            }

            const postData = {
                userId: userData._id,
                content: postContent,
                image: imageUrl, 
            };

            const response = await axios.post(`${backendUrl}/api/posts/create`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Post created successfully');
                setPostContent(''); 
                setImageUri(null);  
                setModalVisible(false);  
                setPosts([...posts, response.data.post]); 
            }
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert('Error', 'Failed to create post.');
        }
    };

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
                setPosts(posts.filter(post => post._id !== postId)); 
            }
        } catch (error) {
            console.error('Error deleting post:', error); 
            Alert.alert('Error', 'Failed to delete post.');
        }
    };

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
                setCommentText('');  
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment.');
        }
    };

    const handleLongPressComment = (comment, postId) => {
        if (comment.userId._id === userData._id) {  
            setSelectedComment({ ...comment, postId });
            setNewCommentText(comment.comment); 
            setCommentModalVisible(true);  
        }
    };

    const handleDeleteComment = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); 
            const response = await axios.delete(
                `${backendUrl}/api/posts/${selectedComment.postId}/comment/${selectedComment._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }, 
                    data: { userId: userData._id }, 
                }
            );

            if (response.status === 200) {
                setPosts(posts.map(post =>
                    post._id === selectedComment.postId
                        ? { ...post, comments: response.data.comments }
                        : post
                ));
                setCommentModalVisible(false); 
                setSelectedComment(null); 
                Alert.alert('Success', 'Comment deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting comment:', error); 
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete comment.');
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
                    userId: userData._id, 
                    newComment: newCommentText, 
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                setPosts(posts.map(post =>
                    post._id === selectedComment.postId
                        ? { ...post, comments: response.data.comments }
                        : post
                ));
                setCommentModalVisible(false); 
                setIsEditing(false); 
                setSelectedComment(null); 
            }
        } catch (error) {
            console.error('Error editing comment:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to edit comment.'); 
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={userData.avatarUrl ? { uri: userData.avatarUrl } : require('../../assets/images/default-avatar.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{userData.fullName}</Text>
                </View>

                <View style={styles.createPostContainer}>
                    <TouchableOpacity style={styles.createPostButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.createPostText}>Create Post</Text>
                    </TouchableOpacity>
                </View>

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

                <View style={styles.postsContainer}>
                    {posts.map((post) => (
                        <View key={post._id} style={styles.post}>
                            <Text style={styles.postAuthor}>
                                {post.userId?.fullName || 'Anonymous'}
                            </Text>
                            <Text style={styles.postDate}>
                                {post.createdAt ? moment(post.createdAt).format('HH:mm DD/MM/YYYY') : ''}
                            </Text>

                            <Text style={styles.postContent}>{post.content}</Text>
                            {post.image && (
                                <Image source={{ uri: post.image }} style={styles.postImage} />
                            )}

                            <View style={styles.postActions}>
                                <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePost(post._id)}>
                                    <Text style={styles.likeButtonText}>Like ({post.likes})</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(post._id)}>
                                    <Text style={styles.deleteButtonText}>Delete Post</Text>
                                </TouchableOpacity>
                            </View>

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
        backgroundColor: '#D07545',
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
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
        backgroundColor: '#EA6116',
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
        backgroundColor: 'red',
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
