import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PremiumNotificationsScreen = () => {
    // Fake data for premium purchases
    const premiumUsers = [
        { id: 1, user: 'user1@example.com', date: '2024-10-15' },
        { id: 2, user: 'user2@example.com', date: '2024-10-16' },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Premium Purchases</Text>
            {premiumUsers.map(user => (
                <View key={user.id} style={styles.premiumBox}>
                    <Text style={styles.premiumText}>User: {user.user}</Text>
                    <Text style={styles.premiumText}>Date: {user.date}</Text>
                </View>
            ))}
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
    premiumBox: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
    },
    premiumText: {
        fontSize: 16,
    },
});

export default PremiumNotificationsScreen;
