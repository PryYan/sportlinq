import {View, Text} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';

const auth = FIREBASE_AUTH;

const Home = () => {
    console.log(auth.currentUser);
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:25}}>Welcome {auth.currentUser?.displayName}</Text>
        </View>
    )
}

export default Home