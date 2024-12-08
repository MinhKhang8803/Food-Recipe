import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function SocialUser() {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const backendUrl = 'https://food-recipe-k8jh.onrender.com';
    const [commentText, setCommentText] = useState('');
    const [selectedComment, setSelectedComment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const user = await AsyncStorage.getItem('user');
                const parsedUser = JSON.parse(user);
                setUserId(parsedUser._id);

                const response = await axios.get(`${backendUrl}/api/social/posts`, {
                    params: { userId: parsedUser._id },
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
    }, []);

    const handleSearch = async () => {
        if (!searchKeyword.trim()) return;
        setIsSearching(true);

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${backendUrl}/api/users/search`, {
                params: { keyword: searchKeyword },
                headers: { Authorization: `Bearer ${token}` },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
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
        }
    };

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

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={searchKeyword}
                    onChangeText={setSearchKeyword}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {searchResults.length > 0 && (
                <View style={styles.searchResultsContainer}>
                    <Text style={styles.searchResultsTitle}>Search Results:</Text>
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.userItem}>
                                <Text style={styles.userName}>{item.fullName || 'Anonymous'}</Text>
                                {item.avatarUrl && (
                                    <Image source={{ uri: item.avatarUrl }} style={styles.userAvatar} />
                                )}
                            </View>
                        )}
                    />
                </View>
            )}

            {/* Danh sách bài viết */}
            <Text style={styles.title}>Social Feed</Text>
            {posts.map((post) => (
                <View key={post._id} style={styles.post}>
                    <Text style={styles.postAuthor}>{post.userId?.fullName || 'Anonymous'}</Text>
                    <Text style={styles.postContent}>{post.content}</Text>
                    {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
                </View>
            ))}

            {posts.map((post) => (
                <View key={post._id} style={styles.post}>
                    <Text style={styles.postAuthor}>{post.userId?.fullName || 'Anonymous'}</Text>

                    <Text style={styles.postContent}>{post.content}</Text>

                    {post.image && (
                        <Image source={{ uri: post.image }} style={styles.postImage} />
                    )}

                    <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePost(post._id)}>
                        <Text style={styles.likeButtonText}>Like ({post.likes})</Text>
                    </TouchableOpacity>

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
    searchContainer: { flexDirection: 'row', marginBottom: 10 },
    searchInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    },
    searchButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        marginLeft: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    searchButtonText: { color: '#fff' },
    searchResultsContainer: { marginTop: 10 },
    searchResultsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    userName: { fontSize: 16, marginRight: 10 },
    userAvatar: { width: 40, height: 40, borderRadius: 20 },
    post: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
    postAuthor: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    postContent: { fontSize: 16, marginBottom: 10 },
    postImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
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
