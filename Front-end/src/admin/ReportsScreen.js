import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';

export default function ReportsScreen() {
    // Sample data for reported posts
    const [reports, setReports] = useState([
        { id: '1', title: 'Inappropriate Recipe', reportedBy: 'User1', postId: '101' },
        { id: '2', title: 'Spam Content', reportedBy: 'User2', postId: '102' },
        { id: '3', title: 'Offensive Language', reportedBy: 'User3', postId: '103' },
    ]);

    // Function to delete a post and warn the user
    const deletePost = (reportId) => {
        Alert.alert('Post Deleted', 'The reported post has been deleted and the user warned.');
        setReports(reports.filter(report => report.id !== reportId)); 
    };

    // Function to dismiss the report and keep the post
    const dismissReport = (reportId) => {
        Alert.alert('Report Dismissed', 'The post has been kept and the report has been removed.');
        setReports(reports.filter(report => report.id !== reportId));  
    };

    const renderReport = ({ item }) => (
        <View style={styles.report}>
            <Text style={styles.reportTitle}>{item.title}</Text>
            <Text style={styles.reportDetail}>Reported by: {item.reportedBy}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePost(item.id)}>
                    <Text style={styles.actionText}>Delete Post & Warn User</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dismissBtn} onPress={() => dismissReport(item.id)}>
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
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.noReports}>No reports available</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    report: {
        padding: 20,
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reportDetail: {
        fontSize: 16,
        marginBottom: 10,
        color: '#6c757d',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteBtn: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
    },
    dismissBtn: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
    },
    noReports: {
        textAlign: 'center',
        fontSize: 18,
        color: '#6c757d',
    },
});
