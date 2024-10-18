import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

const BanUsersScreen = () => {
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [banDuration, setBanDuration] = useState('');

    const handleBan = () => {
        if (email && reason && banDuration) {
            Alert.alert('User Banned', `User ${email} has been banned for ${banDuration} with reason: ${reason}`);
        } else {
            Alert.alert('Error', 'Please fill out all fields');
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
