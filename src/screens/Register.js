import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { AuthContext } from '../../App'; // Import AuthContext

export default function Register({ navigation }) {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
    });

    const { login } = useContext(AuthContext); // To log in after successful registration

    const handleRegister = async () => {
        try {
            // Make POST request to register the user
            const response = await axios.post('http://your-server-ip:5000/register', {
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                phone: form.phone,
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Registration successful! You are now logged in.');
                // Automatically log in the user after registration
                await login(form.email, form.password);
            }
        } catch (error) {
            // Improved error handling to show meaningful message
            const errorMessage = error.response?.data?.message || 'Something went wrong.';
            Alert.alert('Registration Failed', errorMessage);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f64e32' }}>
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                    <View style={styles.header}>
                        <Image
                            alt="App Logo"
                            resizeMode="contain"
                            style={styles.headerImg}
                            source={require("../../assets/favicon.png")} />

                        <Text style={styles.title}>
                            Sign up for <Text style={{ color: '#075eec' }}>CookingApp</Text>
                        </Text>

                        <Text style={styles.subtitle}>
                            Create an account to get started
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Full Name</Text>

                            <TextInput
                                autoCapitalize="words"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                onChangeText={fullName => setForm({ ...form, fullName })}
                                placeholder="John Doe"
                                placeholderTextColor="#6b7280"
                                style={styles.inputControl}
                                value={form.fullName} />
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Email address</Text>

                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                keyboardType="email-address"
                                onChangeText={email => setForm({ ...form, email })}
                                placeholder="abc@example.com"
                                placeholderTextColor="#6b7280"
                                style={styles.inputControl}
                                value={form.email} />
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Password</Text>

                            <TextInput
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                onChangeText={password => setForm({ ...form, password })}
                                placeholder="********"
                                placeholderTextColor="#6b7280"
                                style={styles.inputControl}
                                secureTextEntry={true}
                                value={form.password} />
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Phone Number</Text>

                            <TextInput
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                keyboardType="phone-pad"
                                onChangeText={phone => setForm({ ...form, phone })}
                                placeholder="123-456-7890"
                                placeholderTextColor="#6b7280"
                                style={styles.inputControl}
                                value={form.phone} />
                        </View>

                        <View style={styles.formAction}>
                            <TouchableOpacity
                                onPress={handleRegister}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Sign up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{ marginTop: 'auto' }}>
                    <Text style={styles.formFooter}>
                        Already have an account?{' '}
                        <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        paddingHorizontal: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    title: {
        fontSize: 31,
        fontWeight: '700',
        color: '#1D2A32',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292',
    },
    /** Header */
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 36,
    },
    headerImg: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 36,
    },
    /** Form */
    form: {
        marginBottom: 24,
        paddingHorizontal: 24,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    formAction: {
        marginTop: 4,
        marginBottom: 16,
    },
    formLink: {
        fontSize: 16,
        fontWeight: '600',
        color: '#075eec',
        textAlign: 'center',
    },
    formFooter: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        letterSpacing: 0.15,
    },
    /** Input */
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#075eec',
        borderColor: '#075eec',
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
});