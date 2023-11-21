import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList} from 'react-native';
import React from 'react';
import { useAuth } from '../../../mobile/AuthContext';
import { NavigationProp } from '@react-navigation/native';

interface Routerprops {
  navigation: NavigationProp<any, any>;
}

const Profile = ({ navigation }: Routerprops) => {
    const { userObject, setUserObject} = useAuth();
    const displayKeys = ['email', 'userName', 'fullName', 'city', 'aboutMe'];
    console.log(userObject);

    return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.namePictureContainer}>
            <Image source={require('../../assets/images/logo.png')} style={styles.image} resizeMode='contain'/>
            <Text style={{color:'white', fontSize:16}}>{userObject.fullName}</Text>
            </View>

            <View style={styles.extraInfoContainer}>
              <TouchableOpacity onPress={() => {navigation?.navigate('Vrienden');}}>
                  <View style={styles.extraInfo}>
                  <Text style={{color:'white', fontSize:24}}>0</Text>
                  <Text style={{color:'white'}}>vrienden</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} >
                  <View style={styles.extraInfo}>
                  <Text style={{color:'white', fontSize:24}}>0</Text>
                  <Text style={{color:'white'}}>sessies</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                  <View style={styles.extraInfo}>
                  <Text style={{color:'white', fontSize:24}}>0</Text>
                  <Text style={{color:'white'}}>reviews</Text>
                  </View>
              </TouchableOpacity>
            </View>

          </View>

          <ScrollView style={styles.infoContainer}>
            {Object.keys(userObject).filter((key) => displayKeys.includes(key)).map(key => (
              <View style={styles.dataContainer} key={key}>
                <Text style={{ color: '#C0C9FF', fontSize:12,marginBottom:6}}>{key}</Text>
                <Text style={{ color: 'black', fontSize: 15 }}>{userObject[key]}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems:'flex-start',
        width:'100%',
        height:'100%',
        backgroundColor:'white',
    },
    headerContainer: {
        height:'70%',
        width:'100%',
        backgroundColor:'#7D8DF6',
        flex:1,
    },
    namePictureContainer: {
      width:'100%',
      height:'65%',
      justifyContent:'space-around',
      alignItems:'center',
    },
    image: {
      width:100,
      height:100,
      borderRadius:50,
      backgroundColor:'#555FA3',
    },
    extraInfoContainer: {
      width:'100%',
      height:'30%',
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
    },
    extraInfo: {
      justifyContent:'center',
      alignItems:'center',
      height:'80%',
      width:70,
      borderBottomColor:'white',
      borderBottomWidth:1.3,
    },
    infoContainer: {
        height:'30%',
        width:'100%',
    },
    dataContainer: {
        height:80,
        width:'92%',
        justifyContent:'center',
        paddingLeft:24,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        alignSelf: 'center',
    },
    headerText: {
      color:'white',
    },
});