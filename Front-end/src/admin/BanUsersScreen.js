import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const BanUsersScreen = () => {
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [banDuration, setBanDuration] = useState('7 days'); 

    const handleBan = async () => {
        if (!email || !reason || !banDuration) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        try {
            const response = await axios.post(
                'https://food-recipe-k8jh.onrender.com/api/users/ban-user',
                { email, reason, banDuration },
            );a

            Alert.alert('Success', `User ${email} has been banned for ${banDuration}`);
            setEmail('');
            setReason('');
            setBanDuration('7 days'); // Reset to default
        } catch (error) {
            console.error('Ban error:', error.response?.data?.message);
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Ban User</Text>

            {/* User Email */}
            <TextInput
                style={styles.input}
                placeholder="User Email"
                value={email}
                onChangeText={setEmail}
            />

            {/* Reason for Ban */}
            <TextInput
                style={styles.input}
                placeholder="Reason for Ban"
                value={reason}
                onChangeText={setReason}
            />

            {/* Ban Duration Dropdown */}
            <Text style={styles.label}>Select Ban Duration</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={banDuration}
                    onValueChange={(itemValue) => setBanDuration(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="7 days" value="7 days" />
                    <Picker.Item label="30 days" value="30 days" />
                    <Picker.Item label="60 days" value="60 days" />
                    <Picker.Item label="Permanent" value="Permanent" />
                </Picker>
            </View>

            {/* Ban Button */}
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
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    picker: {
        height: 50,
        width: '100%',
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
