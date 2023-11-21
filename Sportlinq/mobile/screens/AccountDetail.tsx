import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Pressable} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../mobile/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://localhost:5000';
//const API_URL = 'http://{ HIER JOUW IP ADRES }:5000';


const AccountDetail = () => {
    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    
    const [ newUserName, setNewUserName] = useState('');
    const [ newFullName, setNewFullName] = useState('');
    const [ newCity, setNewCity] = useState('');
    const [newAboutMe, setNewAboutMe] = useState('');
    const email = userObject.email;
    // deze const moet hier blijven voor het gebruik binnen
    // updateButton en getInfo
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => {
        setVisible(false);
        setPassword('');
        setNewPassword('');
        setPasswordBackendMessage('');
    };
    const hideWhenConfirm = () => {
        setVisible(false);
        setPassword('');
    };
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);

    // const voor validatie
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [fullNameError, setFullNameError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [aboutMeError, setAboutMeError] = useState(false);

    const [passwordBackendMessage, setPasswordBackendMessage] = useState('');




    
    // useEffect zodat de huidige userObject gebruikt en verandert
    // kan worden in textInput
    useEffect(() => {
        setNewUserName(userObject.userName || '');
        setNewFullName(userObject.fullName || '');
        setNewCity(userObject.city || '');
        setNewAboutMe(userObject.aboutMe || '');
    }, [userObject]);

    function validatePassword(passwordCheck: string) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(passwordCheck);
    }

    type UpdatePayload = {
        email: any;
        newUserName: string;
        newPassword?: string; // zodat wachtwoord optioneel is
        newFullName: string;
        newCity: string;
        newAboutMe: string;
    };

    const updateButton = () => {
        let hasErrors = false;
        // validatie van velden
        if (newUserName.length < 6 || newUserName.length > 30) {
            setUserNameError(true);
            hasErrors = true;
        }else{
            setUserNameError(false);
        }

        if (newFullName.length > 45) {
            setFullNameError(true);
            hasErrors = true;
        }else{
            setFullNameError(false);
        }

        if (newCity.length > 45) {
            setCityError(true);
            hasErrors = true;
        }else{
            setCityError(false);
        }

        if (newAboutMe.length > 220) {
            setAboutMeError(true);
            hasErrors = true;
        }else{
            setAboutMeError(false);
        }

        if (hasErrors) {
            return;
        }


        let payload: UpdatePayload = {
            email,
            newUserName,
            newPassword,
            newFullName,
            newCity,
            newAboutMe,
        };
    
        if (!passwordConfirmed) {
            payload = {
                email,
                newUserName,
                newFullName,
                newCity,
                newAboutMe,
            };
        }

        fetch(`${API_URL}/updateProfile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    console.log(jsonRes.message);
                } else {
                    console.log(jsonRes.message);
                    getUpdatedUserInfo(useToken);
                    setNewPassword('');
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const getUpdatedUserInfo = (token: any) => {
        const payload = {
            email,
        };
        fetch(`${API_URL}/getUpdatedUserInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setUserObject(jsonRes);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const passwordCheck = (token: any) => {
        let hasErrors = false;
        if (!validatePassword(newPassword)) {
            setPasswordError(true);
            hasErrors = true;
        }else{
            setPasswordError(false);
        }

        if (hasErrors) {
            return;
        }

        const payload = {
            email,
            password,
        };
        fetch(`${API_URL}/passwordCheck`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setPasswordBackendMessage(jsonRes.message);
                    hideWhenConfirm();
                    setPasswordConfirmed(true);
                } else {
                    setPasswordBackendMessage(jsonRes.message);
                    setPassword('');
                    setNewPassword('');
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.emailContainer}>
                <Text style={styles.textInput}>{userObject.email}</Text>
            </View>
            <View style={styles.otherContainer}>
                <View style={styles.dataContainer}>
                <Text style={{fontSize:12, marginBottom:5}}>Gebruikersnaam</Text>
                <TextInput style={styles.textInput} placeholder="Gebruikersnaam" autoCapitalize="none" onChangeText={(text) => setNewUserName(text)} value={newUserName} clearButtonMode='always'></TextInput>
                {userNameError && <Text style={styles.errorText}>naam moet tussen 6 en 30 karakters</Text>}
                </View>

                <View style={styles.dataContainer}>
                <Text style={{fontSize:12, marginBottom:5}}>Volledige naam</Text>
                <TextInput style={styles.textInput} placeholder="Volledige naam" autoCapitalize="none" onChangeText={(text) => setNewFullName(text)} value={newFullName} clearButtonMode='always'></TextInput>
                {fullNameError && <Text style={styles.errorText}>verkort je naam voor het profiel</Text>}
                </View>

                <View style={styles.dataContainer}>
                <Text style={{fontSize:12, marginBottom:5}}>Stad</Text>
                <TextInput style={styles.textInput} placeholder="Stad" autoCapitalize="none" onChangeText={(text) => setNewCity(text)} value={newCity} clearButtonMode='always'></TextInput>
                {cityError && <Text style={styles.errorText}>verkort de stadsnaam</Text>}
                </View>

                <View style={styles.dataContainer}>
                <Text style={{fontSize:12, marginBottom:5}}>Over mij</Text>
                <TextInput style={styles.textInput} placeholder="Over mij" autoCapitalize="none" onChangeText={(text) => setNewAboutMe(text)} value={newAboutMe} clearButtonMode='always'></TextInput>
                {aboutMeError && <Text style={styles.errorText}>Maximaal 220 karakters</Text>}
                </View>
            </View>

            <TouchableOpacity onPress={show}>
                <View style={styles.passwordContainer}>
                <Text style={styles.textInput}>Wachtwoord</Text>
                <FontAwesome name="angle-right" size={25} color='black' style={{ marginRight: 15}}/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={updateButton}>
                    <Text>Update account</Text>
            </TouchableOpacity>
            

            <Modal visible={visible} animationType="fade" onRequestClose={hide} transparent>
            {passwordConfirmed ? (
                <>
                    <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                            <TouchableOpacity onPress={hide}>
                                <FontAwesome name="close" size={25} color='black'/>
                            </TouchableOpacity>
                            <Text>Er is al een nieuwe wachtwoord ingevoerd.</Text>
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                            <TouchableOpacity onPress={hide}>
                                <FontAwesome name="close" size={25} color='black'/>
                            </TouchableOpacity>
                            <TextInput secureTextEntry={true} placeholder="Huidige wachtwoord" onChangeText={(text) => setPassword(text)} value={password} clearButtonMode='always'></TextInput>
                            <Text style={{ color: passwordBackendMessage === 'Wachtwoord komt overeen' ? 'green' : 'red' }}>{passwordBackendMessage ? passwordBackendMessage : null}</Text>
                            <TextInput secureTextEntry={true} placeholder="Nieuwe wachtwoord" onChangeText={(text) => setNewPassword(text)} value={newPassword} clearButtonMode='always'></TextInput>
                            {passwordError && <Text style={styles.errorText}>minimaal 8 tekens, hoofdletter, cijfer en speciaal teken</Text>}
                            <TouchableOpacity onPress={passwordCheck}>
                                <FontAwesome name="check" size={25} color='black'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
            </Modal>
        </View>
        
    );
    
}

export default AccountDetail

const styles = StyleSheet.create({
    mainContainer: {
        flex:1
    },
    emailContainer: {
        height: 70,
        width:'100%',
        backgroundColor:'white',
        marginTop:22,
        justifyContent:'center',
        paddingLeft:18,
    },
    otherContainer: {
        justifyContent:'flex-start',
        alignItems:'center',
        width: '100%',
        height:350,
        backgroundColor:'white',
        marginTop:22,
    },
    dataContainer: {
        width:'90%',
        height:66,
        borderBottomColor:'lightgrey',
        borderBottomWidth:1,
        justifyContent:'flex-end',
        paddingBottom:5,
        marginTop:12,
    },
    passwordContainer: {
        height: 70,
        width:'100%',
        backgroundColor:'white',
        marginTop:22,
        justifyContent:'flex-start',
        alignItems:'center',
        paddingLeft:18,
        flexDirection:'row',
    },
    modalContainer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(200, 200, 200, 0.5)',
    },
    modal: {
        width:300,
        height:500,
        backgroundColor:'white',
        opacity:1
    },
    textInput: {
        fontSize:16,
    },
    errorText: {
        color:'red',
        textAlign:'center'
    },
    errorInput: {
        borderColor:'red'
    },
});