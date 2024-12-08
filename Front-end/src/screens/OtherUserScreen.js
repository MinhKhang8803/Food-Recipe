import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Modal, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function OtherUserScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { userId } = route.params;
    const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);

    const backendUrl = 'https://food-recipe-k8jh.onrender.com';

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/users/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${backendUrl}/api/posts/${userId}/posts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, [userId]);

    const handleLikePost = async (postId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`${backendUrl}/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.map(post => post._id === postId ? { ...post, likes: response.data.likes } : post));
        } catch (error) {
            Alert.alert('Error', 'Failed to like post.');
        }
    };

    const handleAddComment = async (postId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`${backendUrl}/api/posts/${postId}/comment`, {
                comment: commentText,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.map(post => post._id === postId ? { ...post, comments: response.data.comments } : post));
            setCommentText('');
        } catch (error) {
            Alert.alert('Error', 'Failed to add comment.');
        }
    };

    const handleReportPost = async () => {
        if (!reportReason.trim()) {
            Alert.alert('Error', 'Please enter a reason for reporting.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'Authentication token is missing.');
                return;
            }

            await axios.post(
                `${backendUrl}/api/posts/report`,
                { postId: selectedPostId, reason: reportReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert('Success', 'The post has been reported.');
            setModalVisible(false);
            setReportReason('');
        } catch (error) {
            console.error('Error reporting post:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to report the post.');
        }
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={userData.avatarUrl ? { uri: userData.avatarUrl } : require('../../assets/images/default-avatar.png')}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{userData.fullName || 'User'}</Text>
            </View>

            <Text style={styles.sectionTitle}>Posts</Text>
            {posts.map(post => (
                <View key={post._id} style={styles.postContainer}>
                    <Text style={styles.postContent}>{post.content}</Text>
                    {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
                    <Text style={styles.postDate}>{moment(post.createdAt).format('DD/MM/YYYY HH:mm')}</Text>

                    <TouchableOpacity onPress={() => handleLikePost(post._id)} style={styles.likeButton}>
                        <Text>Like ({post.likes})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedPostId(post._id);
                            setModalVisible(true);
                        }}
                        style={styles.reportButton}
                    >
                        <Text style={styles.reportButtonText}>Report</Text>
                    </TouchableOpacity>
                    <View style={styles.commentSection}>
                        <TextInput
                            placeholder="Write a comment..."
                            value={commentText}
                            onChangeText={setCommentText}
                            style={styles.commentInput}
                        />
                        <TouchableOpacity onPress={() => handleAddComment(post._id)} style={styles.commentButton}>
                            <Text style={styles.commentButtonText}>Comment</Text>
                        </TouchableOpacity>
                    </View>

                    {post.comments.map((comment, index) => (
                        <Text key={index} style={styles.commentText}>
                            {comment.userId?.fullName}: {comment.comment}
                        </Text>
                    ))}
                </View>
            ))}
            <Modal visible={modalVisible} transparent animationType="slide">
                <KeyboardAvoidingView style={styles.modalContainer} behavior="padding">
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Report Post</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter reason for reporting"
                            value={reportReason}
                            onChangeText={setReportReason}
                            multiline
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleReportPost} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { alignItems: 'center', padding: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    name: { fontSize: 20, fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, marginTop: 10 },
    postContainer: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
    postContent: { fontSize: 16 },
    postImage: { width: '100%', height: 200, marginTop: 10 },
    postDate: { color: '#777', fontSize: 12, marginTop: 5 },
    likeButton: { marginTop: 10 },
    commentSection: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    commentInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 8, marginRight: 10 },
    commentButton: { backgroundColor: '#007BFF', padding: 8, borderRadius: 5 },
    commentButtonText: { color: '#fff' },
    commentText: { marginTop: 5, fontSize: 14 },
    reportButton: { backgroundColor: '#ff4757', padding: 10, borderRadius: 5, marginTop: 10 },
    reportButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    modalInput: { borderColor: '#ddd', borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 15 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelButton: { backgroundColor: '#aaa', padding: 10, borderRadius: 5 },
    cancelButtonText: { color: '#fff', textAlign: 'center' },
    submitButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
    submitButtonText: { color: '#fff', textAlign: 'center' },
});
