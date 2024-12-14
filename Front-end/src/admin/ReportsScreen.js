import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportsScreen() {
    const [reports, setReports] = useState([]);
    const backendUrl = 'https://food-recipe-k8jh.onrender.com';

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${backendUrl}/api/users/reports`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);

    const deletePost = async (postId, reportId) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this post and warn the user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await axios.delete(`${backendUrl}/api/users/reports/${reportId}/post/${postId}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            setReports(reports.filter((report) => report._id !== reportId));
                            Alert.alert('Success', 'Post and report deleted successfully.');
                        } catch (error) {
                            console.error('Error deleting post and report:', error);
                            Alert.alert('Error', 'Failed to delete post and report.');
                        }
                    },
                },
            ]
        );
    };

    const dismissReport = async (reportId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${backendUrl}/api/users/reports/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReports(reports.filter((report) => report._id !== reportId));
            Alert.alert('Success', 'Report dismissed successfully.');
        } catch (error) {
            console.error('Error dismissing report:', error);
            Alert.alert('Error', 'Failed to dismiss report.');
        }
    };

    const renderReport = ({ item }) => (
        <View style={styles.report}>
            <Text style={styles.reportTitle}>{item.reason}</Text>
            <Text style={styles.reportDetail}>Reported by: {item.reportedBy.fullName}</Text>
            <Text style={styles.reportDetail}>Post: {item.postId.content}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePost(item.postId._id, item._id)}>
                    <Text style={styles.actionText}>Delete Post & Warn User</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dismissBtn} onPress={() => dismissReport(item._id)}>
                    <Text style={styles.actionText}>Dismiss Report</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Reported Posts</Text>
            <FlatList
                data={reports}
                renderItem={renderReport}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text style={styles.noReports}>No reports available</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, paddingVertical: 30, backgroundColor: '#f8f9fa' },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    report: { padding: 20, marginBottom: 15, backgroundColor: '#fff', borderRadius: 8, elevation: 3 },
    reportTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    reportDetail: { fontSize: 16, marginBottom: 10, color: '#6c757d' },
    actions: { flexDirection: 'row', justifyContent: 'space-between' },
    deleteBtn: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5 },
    dismissBtn: { backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
    actionText: { color: '#fff', fontWeight: '600' },
    noReports: { textAlign: 'center', fontSize: 18, color: '#6c757d' },
});
