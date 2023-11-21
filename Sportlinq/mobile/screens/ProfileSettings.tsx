import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import { useAuth } from '../../mobile/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';

interface Routerprops {
    navigation: NavigationProp<any, any>;
}

const ProfileSettings = ({ navigation }: Routerprops) => {
    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.infoContainer}>
                <TouchableOpacity 
                onPress={() => {
                    navigation?.navigate('AccountDetail');
                }}>
                <Text style={{color:'black'}}>Je account</Text>
                <FontAwesome name="user" size={25} color='black' style={{ marginRight: 15}}/>
                <Text style={{color:'black'}}>Accountbeheer</Text>
                <Text style={{color:'black'}}>Wachtwoord, persoonlijke gegevens, over mij</Text>
                <Text style={{color:'black'}}>Beheer je accountinstellingen</Text>
                <FontAwesome name="angle-right" size={25} color='black' style={{ marginRight: 15}}/>
                </TouchableOpacity>
            </View>
            {/* <View style={{height:'12%', width:'100%', backgroundColor:'white', marginBottom:6}}></View>
            <View style={{height:'15%', width:'100%', backgroundColor:'white', marginBottom:6,position:'absolute',}}></View>
            <View style={{height:'8%', width:'100%', backgroundColor:'white', marginBottom:6,position:'absolute',}}></View>
            <View style={{height:'10%', width:'100%', backgroundColor:'white', marginBottom:6,position:'absolute',}}></View>
            <View style={{height:'10%', width:'100%', backgroundColor:'white', marginBottom:6,position:'absolute',}}></View>
            <View style={{height:'10%', width:'100%', backgroundColor:'white', marginBottom:6,position:'absolute',}}></View> */}
            <View style={styles.endContainer}>
                <TouchableOpacity 
                style={styles.button}
                onPress={() => {
                    setToken(null);
                    setUserObject(null);
                }}>
                    <Text style={{color:'red'}}>Uitloggen</Text>
                    <FontAwesome name="sign-out" size={25} color='red' style={{ marginRight: 15}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      );
}

export default ProfileSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems:'flex-start',
        width:'100%',
        height:'100%',
        position:'relative',
    },
    infoContainer: {
        height:'20%',
        width:'100%',
        backgroundColor:'white',
        position:'absolute',
        marginTop:10,
    },
    endContainer: {
        height:'10%',
        width:'100%',
        backgroundColor:'white',
        position:'absolute',
        bottom:0,
    },
    button: {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    }
});