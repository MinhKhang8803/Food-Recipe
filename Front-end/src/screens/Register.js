import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
    });

    const [error, setError] = useState('');
    const navigation = useNavigation();

    // Regular expression for valid email domains
    const emailPattern = /^[a-zA-Z0-9._-]+@(gmail.com|yahoo.com|outlook.com|icloud.com|hotmail.com)$/;

    // Regular expression for password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    // Reset form when navigating to this screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setForm({
                fullName: '',
                email: '',
                password: '',
                phone: '',
            });
            setError('');
        });

        return unsubscribe;
    }, [navigation]);

    const handleRegister = async () => {
        const { fullName, email, password, phone } = form;

        if (!fullName || !email || !password || !phone) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address with the correct domain: @gmail.com, @yahoo.com, @outlook.com');
            return;
        }

        if (!passwordPattern.test(password)) {
            setError('Password must be between 8-15 characters and include at least one uppercase letter, one number, and one special character.');
            return;
        }

        try {
            const response = await axios.post('https://food-recipe-k8jh.onrender.com/api/auth/register', {
                fullName,
                email,
                password,
                phone,
            });
            console.log(response.status);

            if (response.status === 201) {
                Alert.alert('Success', 'Registration successful');
                setForm({ fullName: '', email: '', password: '', phone: '' });
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', response.data.message || 'Failed to register. Try again.');
            }
        } catch (error) {
            if (error.response) {
                Alert.alert('Error', error.response.data.message || 'Server error occurred');
            } else {
                Alert.alert('Error', 'Unable to connect to the server');
            }
            console.error('Registration error: ', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                    <View style={styles.header}>
                        <Image
                            alt="App Logo"
                            resizeMode="contain"
                            style={styles.headerImg}
                            source={require("../../assets/favicon.png")} />

                        <Text style={styles.title}>
                            Sign up for <Text style={{ color: '#f64e32' }}>KT Recipe</Text>
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
                                placeholder="Tung"
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

                        {error && error.includes('email') ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

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

                        {error && error.includes('Password') ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <TextInput
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                keyboardType="phone-pad"
                                onChangeText={phone => setForm({ ...form, phone })}
                                placeholder="023-547-6859"
                                placeholderTextColor="#6b7280"
                                style={styles.inputControl}
                                value={form.phone} />
                        </View>

                        <View style={styles.formAction}>
                            <TouchableOpacity onPress={handleRegister}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Sign up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 'auto' }}>
                    <Text style={styles.formFooter}>
                        Already have an account? <Text style={{ textDecorationLine: 'underline', color: '#f64e32' }}>Sign in</Text>
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
        backgroundColor: '#f64e32',
        borderColor: '#f64e32',
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
    /** Error Text */
    errorText: {
        color: 'red',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
});
