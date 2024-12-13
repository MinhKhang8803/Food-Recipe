import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const BanUsersScreen = () => {
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [banDuration, setBanDuration] = useState('7 days');
    const [bannedUsers, setBannedUsers] = useState([]);

    useEffect(() => {
        fetchBannedUsers();
    }, []);

    const fetchBannedUsers = async () => {
        try {
            const response = await axios.get('https://192.168.1.10/api/users/banned-users');
            setBannedUsers(response.data);
        } catch (error) {
            console.error('Error fetching banned users:', error.message);
            Alert.alert('Error', 'Failed to fetch banned users');
        }
    };

    const handleBan = async () => {
        if (!email || !reason || !banDuration) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        try {
            console.log('Sending ban request:', { email, reason, banDuration });

            const response = await axios.post(
                'https://192.168.1.10/api/users/ban-user',
                { email, reason, banDuration }
            );

            console.log('Ban response:', response.data);
            Alert.alert('Success', `User ${email} has been banned for ${banDuration}`);
            setEmail('');
            setReason('');
            setBanDuration('7 days');
            fetchBannedUsers();
        } catch (error) {
            console.error('Ban error:', error.response?.data || error.message);
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

            <TouchableOpacity style={styles.btn} onPress={handleBan}>
                <Text style={styles.btnText}>Ban User</Text>
            </TouchableOpacity>

            <Text style={styles.subTitle}>Banned Users</Text>
            <FlatList
                data={bannedUsers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.banItem}>
                        <Text style={styles.banEmail}>{item.email}</Text>
                        <Text style={styles.banReason}>Reason: {item.reason}</Text>
                        <Text style={styles.banDuration}>Duration: {item.banDuration}</Text>
                        <Text style={styles.banDate}>
                            Banned At: {new Date(item.bannedAt).toLocaleString()}
                        </Text>
                    </View>
                )}
            />
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
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
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
    banItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    banEmail: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    banReason: {
        color: '#555',
    },
    banDuration: {
        color: '#555',
    },
    banDate: {
        color: '#777',
    },
});

export default BanUsersScreen;
