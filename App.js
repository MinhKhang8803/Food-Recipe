import React, { createContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigation from './src/navigation';  // Ensure the path to navigation is correct
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Auth Context
export const AuthContext = createContext();

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in by retrieving token from AsyncStorage
  const checkUserLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
      }
    } catch (error) {
      console.error('Error fetching user token from AsyncStorage:', error);
    }
    setIsLoading(false);  // Ensure loading stops whether token is found or not
  };

  // On app load, check if the user is already authenticated
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://your-server-ip:5000/login', { email, password });
      const token = response.data.token;
      if (token) {
        setUserToken(token);
        await AsyncStorage.setItem('userToken', token);  // Save the token for future auto-login
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      throw error;  // Rethrow the error so it can be handled in Login.js
    }
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');  // Remove the token on logout
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      <I18nextProvider i18n={i18n}>
        <View style={{ flex: 1 }}>
          <AppNavigation />
          <StatusBar style="auto" />
        </View>
      </I18nextProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
