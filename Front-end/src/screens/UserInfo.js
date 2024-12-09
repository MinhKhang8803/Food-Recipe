import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function UserInfo() {
    const navigation = useNavigation();
    const backendUrl = 'http://192.168.1.6:5000';
    const [avatar, setAvatar] = useState(null);
    const [userData, setUserData] = useState({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
    });

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUserData = await AsyncStorage.getItem('user');
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                setUserData(userData);
                setAvatar(userData.avatarUrl);
            }

            if (!token) {
                Alert.alert('Session Expired', 'Please log in again.');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const pickImage = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                alert('Permission to access photo library is required!');
                return;
            }

            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                base64: false,
            });

            console.log('Picker Result:', pickerResult);

            if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
                const selectedImage = pickerResult.assets[0].uri;
                console.log('Selected Image URI:', selectedImage);
                setAvatar(selectedImage);

                await uploadImage(selectedImage);
            } else {
                Alert.alert('Error', 'No image selected');
            }
        } catch (error) {
            console.error('Error during image picking:', error);
            Alert.alert('Error', 'Failed to pick an image.');
        }
    };

    const uploadImage = async (uri) => {
        try {
            const response = await fetch(uri);
            if (!response.ok) throw new Error('Failed to fetch image URI');
            const blob = await response.blob();

            console.log('Uploading image to Firebase...');

            const storageRef = ref(storage, `avatars/${userData.email}_${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            console.log('Image uploaded successfully, URL:', downloadURL);
            setAvatar(downloadURL);

            const token = await AsyncStorage.getItem('token');
            const result = await axios.put(`${backendUrl}/api/users/update-avatar`, {
                avatarUrl: downloadURL,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (result.status === 200) {
                const updatedUserData = { ...userData, avatarUrl: downloadURL };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));

                setUserData(updatedUserData);
                Alert.alert('Success', 'Profile picture updated successfully!');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image.');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            navigation.replace('Login');
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Error', 'Failed to log out.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Image
                    source={avatar ? { uri: avatar } : require('../../assets/images/default-avatar.png')}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                />

                <TouchableOpacity onPress={pickImage} style={{ marginTop: 10 }}>
                    <Text style={{ color: '#075eec' }}>Change Profile Picture</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Full Name</Text>
                <TextInput
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    value={userData.fullName}
                    onChangeText={(text) => setUserData({ ...userData, fullName: text })}
                />

                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Email</Text>
                <TextInput
                    style={{ borderBottomWidth: 1 }}
                    value={userData.email}
                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                />
            </View>

            <TouchableOpacity
                onPress={() => {
                    alert('Changes saved!');
                }}
                style={{ backgroundColor: '#075eec', padding: 10, borderRadius: 5, alignItems: 'center' }}
            >
                <Text style={{ color: '#fff' }}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleLogout}
                style={{ backgroundColor: '#d9534f', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20 }}
            >
                <Text style={{ color: '#fff' }}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
