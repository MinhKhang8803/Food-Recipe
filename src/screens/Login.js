import React, { useState } from 'react';
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

export default function Login({ navigation }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    // Fixed credentials for login
    const correctEmail = 'user@gmail.com';
    const correctPassword = 'Password123@';

    const handleLogin = () => {
        // Check if entered email and password match the fixed credentials
        if (form.email === correctEmail && form.password === correctPassword) {
            // Navigate to HomeScreen if login is successful
            navigation.navigate('Home');
        } else {
            // Show error alert if login fails
            Alert.alert('Login Failed', 'The email or password you entered is incorrect.');
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
                            Sign in to <Text style={{ color: '#075eec' }}>CookingApp</Text>
                        </Text>

                        <Text style={styles.subtitle}>
                            Get access to your recipes and more
                        </Text>
                    </View>

                    <View style={styles.form}>
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

                        <TouchableOpacity>
                            <Text style={styles.formLink}>Forgot password?</Text>
                        </TouchableOpacity>

                        <View style={styles.formAction}>
                            <TouchableOpacity
                                onPress={handleLogin}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Sign in</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={{ marginTop: 'auto' }}>
                    <Text style={styles.formFooter}>
                        Don't have an account?{' '}
                        <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
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
        marginBottom: 16,
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




// import React, { useState } from 'react';
// import {
//     StyleSheet,
//     SafeAreaView,
//     View,
//     Image,
//     Text,
//     TouchableOpacity,
//     TextInput,
// } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// export default function Example() {
//     const [form, setForm] = useState({
//         email: '',
//         password: '',
//     });
//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: '#f64e32' }}>
//             <View style={styles.container}>
//                 <KeyboardAwareScrollView>
//                     <View style={styles.header}>
//                         <Image
//                             alt="App Logo"
//                             resizeMode="contain"
//                             style={styles.headerImg}
//                             source={require("../../assets/favicon.png")} />

//                         <Text style={styles.title}>
//                             Sign in to <Text style={{ color: '#075eec' }}>CookingApp</Text>
//                         </Text>

//                         <Text style={styles.subtitle}>
//                             Get access to your recipes and more
//                         </Text>
//                     </View>

//                     <View style={styles.form}>
//                         <View style={styles.input}>
//                             <Text style={styles.inputLabel}>Email address</Text>

//                             <TextInput
//                                 autoCapitalize="none"
//                                 autoCorrect={false}
//                                 clearButtonMode="while-editing"
//                                 keyboardType="email-address"
//                                 onChangeText={email => setForm({ ...form, email })}
//                                 placeholder="abc@example.com"
//                                 placeholderTextColor="#6b7280"
//                                 style={styles.inputControl}
//                                 value={form.email} />
//                         </View>

//                         <View style={styles.input}>
//                             <Text style={styles.inputLabel}>Password</Text>

//                             <TextInput
//                                 autoCorrect={false}
//                                 clearButtonMode="while-editing"
//                                 onChangeText={password => setForm({ ...form, password })}
//                                 placeholder="********"
//                                 placeholderTextColor="#6b7280"
//                                 style={styles.inputControl}
//                                 secureTextEntry={true}
//                                 value={form.password} />
//                         </View>

//                         <View style={styles.formAction}>
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     // handle onPress
//                                 }}>
//                                 <View style={styles.btn}>
//                                     <Text style={styles.btnText}>Sign in</Text>
//                                 </View>
//                             </TouchableOpacity>
//                         </View>

//                         <Text style={styles.formLink}>Forgot password?</Text>
//                     </View>
//                 </KeyboardAwareScrollView>

//                 <TouchableOpacity
//                     onPress={() => {
//                         // handle link
//                     }}
//                     style={{ marginTop: 'auto' }}>
//                     <Text style={styles.formFooter}>
//                         Don't have an account?{' '}
//                         <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         paddingVertical: 24,
//         paddingHorizontal: 0,
//         flexGrow: 1,
//         flexShrink: 1,
//         flexBasis: 0,
//     },
//     title: {
//         fontSize: 31,
//         fontWeight: '700',
//         color: '#1D2A32',
//         marginBottom: 6,
//     },
//     subtitle: {
//         fontSize: 15,
//         fontWeight: '500',
//         color: '#929292',
//     },
//     /** Header */
//     header: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginVertical: 36,
//     },
//     headerImg: {
//         width: 80,
//         height: 80,
//         alignSelf: 'center',
//         marginBottom: 36,
//     },
//     /** Form */
//     form: {
//         marginBottom: 24,
//         paddingHorizontal: 24,
//         flexGrow: 1,
//         flexShrink: 1,
//         flexBasis: 0,
//     },
//     formAction: {
//         marginTop: 4,
//         marginBottom: 16,
//     },
//     formLink: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#075eec',
//         textAlign: 'center',
//     },
//     formFooter: {
//         fontSize: 15,
//         fontWeight: '600',
//         color: '#222',
//         textAlign: 'center',
//         letterSpacing: 0.15,
//     },
//     /** Input */
//     input: {
//         marginBottom: 16,
//     },
//     inputLabel: {
//         fontSize: 17,
//         fontWeight: '600',
//         color: '#222',
//         marginBottom: 8,
//     },
//     inputControl: {
//         height: 50,
//         backgroundColor: '#fff',
//         paddingHorizontal: 16,
//         borderRadius: 12,
//         fontSize: 15,
//         fontWeight: '500',
//         color: '#222',
//         borderWidth: 1,
//         borderColor: '#C9D3DB',
//         borderStyle: 'solid',
//     },
//     /** Button */
//     btn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 30,
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderWidth: 1,
//         backgroundColor: '#075eec',
//         borderColor: '#075eec',
//     },
//     btnText: {
//         fontSize: 18,
//         lineHeight: 26,
//         fontWeight: '600',
//         color: '#fff',
//     },
// });