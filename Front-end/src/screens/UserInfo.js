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
import { storage } from '../../firebase';  // Firebase storage
import AsyncStorage from '@react-native-async-storage/async-storage';  // AsyncStorage for JWT token
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Import các hàm từ firebase/storage


export default function UserInfo() {  // Đổi tên component thành UserScreen
    const navigation = useNavigation();
    const backendUrl = 'http://192.168.1.6:5000';  // Replace with your actual IP and port
    const [avatar, setAvatar] = useState(null);  // Avatar image URL
    const [userData, setUserData] = useState({
        fullName: 'John Doe',  // Default user data, replace with actual data from your API
        email: 'john.doe@example.com',
    });

    // Fetch user data when component loads
    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUserData = await AsyncStorage.getItem('user');
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                setUserData(userData);
                setAvatar(userData.avatarUrl);  // Hiển thị avatar từ AsyncStorage
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
        fetchUserData();  // Fetch user data when the component loads
    }, []);

    // Function to handle image picking and uploading to Firebase
    const pickImage = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                alert('Permission to access photo library is required!');
                return;
            }
    
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                base64: false,  // No base64, chỉ cần URI file
            });
    
            console.log('Picker Result:', pickerResult);
    
            if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
                const selectedImage = pickerResult.assets[0].uri;  // Get the image URI
                console.log('Selected Image URI:', selectedImage);  // Log URI for debugging
                setAvatar(selectedImage);  // Set the selected image to state
    
                // Gọi hàm upload ảnh lên Firebase
                await uploadImage(selectedImage);
            } else {
                Alert.alert('Error', 'No image selected');
            }
        } catch (error) {
            console.error('Error during image picking:', error);
            Alert.alert('Error', 'Failed to pick an image.');
        }
    };
    

    // Function to upload the image to Firebase
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
            setAvatar(downloadURL);  // Cập nhật ảnh mới trên màn hình
    
            // Gửi request PUT tới backend để cập nhật avatar URL
            const token = await AsyncStorage.getItem('token');
            const result = await axios.put(`${backendUrl}/api/users/update-avatar`, {
                avatarUrl: downloadURL,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Đính kèm token trong request header
                },
            });
    
            if (result.status === 200) {
                // Cập nhật lại thông tin người dùng trong AsyncStorage sau khi URL avatar được cập nhật
                const updatedUserData = { ...userData, avatarUrl: downloadURL };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
    
                setUserData(updatedUserData);  // Cập nhật lại state người dùng
                Alert.alert('Success', 'Profile picture updated successfully!');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image.');
        }
    };
    
    

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                {/* Display Avatar */}
                <Image
                    source={avatar ? { uri: avatar } : require('../../assets/images/default-avatar.png')}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                />

                {/* Button to upload new avatar */}
                <TouchableOpacity onPress={pickImage} style={{ marginTop: 10 }}>
                    <Text style={{ color: '#075eec' }}>Change Profile Picture</Text>
                </TouchableOpacity>
            </View>

            {/* Display user info */}
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

            {/* Button to save changes */}
            <TouchableOpacity
                onPress={() => {
                    // TODO: Save changes logic
                    alert('Changes saved!');
                }}
                style={{ backgroundColor: '#075eec', padding: 10, borderRadius: 5, alignItems: 'center' }}
            >
                <Text style={{ color: '#fff' }}>Save Changes</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}