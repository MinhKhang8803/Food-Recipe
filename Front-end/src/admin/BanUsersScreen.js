import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const BanUsersScreen = () => {
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [banDuration, setBanDuration] = useState('');

    const handleBan = async () => {
        if (!email || !reason || !banDuration) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        try {
            const response = await axios.post(
                'https://food-recipe-k8jh.onrender.com/api/users/ban-user',
                { email, reason, banDuration },
                { headers: { Authorization: 'Bearer <YOUR_AUTH_TOKEN>' } } // Replace with actual auth token
            );

            Alert.alert('Success', `User ${email} has been banned successfully!`);
            setEmail('');
            setReason('');
            setBanDuration('');
        } catch (error) {
            console.error('Ban error:', error.response.data.message);
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Ban User</Text>

            <TextInput
                style={styles.input}
                placeholder="User Email"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Reason for Ban"
                value={reason}
                onChangeText={setReason}
            />

            <TextInput
                style={styles.input}
                placeholder="Ban Duration (e.g. 7 days, Permanent)"
                value={banDuration}
                onChangeText={setBanDuration}
            />

            <TouchableOpacity style={styles.btn} onPress={handleBan}>
                <Text style={styles.btnText}>Ban User</Text>
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
    input: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    btn: {
        backgroundColor: '#ff5a5f',
        paddingVertical: 15,
        borderRadius: 10,
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BanUsersScreen;
