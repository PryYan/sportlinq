import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, TouchableOpacity, ScrollView} from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true);

interface Routerprops {
    navigation: NavigationProp<any, any>;
}

const Inloggen = ({ navigation }: Routerprops) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    function resetValues() {
        setEmail('');
        setPassword('');
    }

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            //console.log(auth.currentUser?.email);
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed: '+ error.message);
            resetValues();
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
          <View style={styles.registerContainer}>
            <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder='Email' autoCapitalize='none'
            onChangeText={(text) => setEmail(text)} value={email}></TextInput>
            <TextInput style={styles.input} placeholder='Password' autoCapitalize='none' secureTextEntry={true}
            onChangeText={(text) => setPassword(text)} value={password}></TextInput>
            </View>
            <View style={styles.buttonContainer}>
            { loading ? (<ActivityIndicator size='large' color='#7D8DF6' />)
            : (<>
                <TouchableOpacity style={styles.button} onPress={() => signIn()}>
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>
                <Text style={{padding:2, color:'dimgrey'}}>or</Text>
                <TouchableOpacity 
                style={styles.button2} 
                onPress={() => {
                    resetValues();
                    navigation?.navigate('Registreren');
                }}>
                <Text style={styles.buttonText2}>Sign up</Text>
                </TouchableOpacity>
            </>)}
            </View>
          </View>
        </View>
    )

    // return (
    //     <View style={styles.container}>
    //         <KeyboardAvoidingView behavior='padding'>
    //         <TextInput style={styles.input} placeholder='Email' autoCapitalize='none'
    //         onChangeText={(text) => setEmail(text)} value={email}></TextInput>
    //         <TextInput style={styles.input} placeholder='Password' autoCapitalize='none' secureTextEntry={true}
    //         onChangeText={(text) => setPassword(text)} value={password}></TextInput>
    //     { loading ? (<ActivityIndicator size='large' color='#0000ff' />)
    //     : (<>
    //         <TouchableOpacity style={styles.button} onPress={() => signIn()}>
    //             <Text style={styles.buttonText}>Log in</Text>
    //         </TouchableOpacity>
    //        </>)}
    //        </KeyboardAvoidingView>
    //     </View>
    // )           // ORIGINAL
}

export default Inloggen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width:'100%',
        backgroundColor:'#7D8DF6',
    },
    registerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '38%',
        flexDirection:'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        borderTopLeftRadius:50,
        borderTopRightRadius:50
    },
    inputContainer: {
        width: '100%',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    input: {
        width: '85%',
        marginVertical: 4,
        height: 50,
        padding: 10,
        backgroundColor: 'transparent',
        borderBottomWidth: 1, 
        borderColor: 'dimgrey',
        fontSize:17,
        color:'dimgrey'
    },
    buttonContainer: {
        width:'100%',
        paddingTop:10,
        paddingBottom:40,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor:'#7D8DF6',
        padding: 11,
        borderRadius: 14,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button2: {
        padding: 11,
        borderRadius: 14,
        borderWidth:1,
        borderColor:'#7D8DF6',
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
      },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonText2: {
        color: '#7D8DF6',
        fontSize: 16,
    },
});