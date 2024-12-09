import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const AdminHomeScreen = ({ navigation }) => {
    const userCount = 1500;
    const postsThisWeek = 45;
    const postsThisMonth = 120;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>

            <View style={styles.statBox}>
                <Text style={styles.statTitle}>Total Users:</Text>
                <Text style={styles.statValue}>{userCount}</Text>
            </View>

            <View style={styles.statBox}>
                <Text style={styles.statTitle}>Posts This Week:</Text>
                <Text style={styles.statValue}>{postsThisWeek}</Text>
            </View>

            <View style={styles.statBox}>
                <Text style={styles.statTitle}>Posts This Month:</Text>
                <Text style={styles.statValue}>{postsThisMonth}</Text>
            </View>

            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Reports')}>
                <Text style={styles.navButtonText}>View Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('BanUsers')}>
                <Text style={styles.navButtonText}>Ban User</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    statBox: {
        padding: 20,
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    statTitle: {
        fontSize: 18,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 5,
    },
    navButton: {
        backgroundColor: '#ff5a5f',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    navButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AdminHomeScreen;
