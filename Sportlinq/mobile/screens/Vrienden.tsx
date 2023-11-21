import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, Modal } from 'react-native';
import { NavigationContext, NavigationProp } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../../mobile/AuthContext';

interface Routerprops {
    navigation: NavigationProp<any, any>;
}

interface User {
    user_id: number;
    email: string;
    userName: string;
    fullName: string;
    city: string;
  }

const API_URL = 'http://localhost:5000';
//const API_URL = 'http://{ HIER JOUW IP ADRES }:5000';

  
export default function Vrienden({ navigation }: Routerprops) {
    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    const currentUser = userObject.user_id;

    const [search, setSearch] = useState('');
    const [searchUsers, setSearchUsers] = useState<User[]>([]);
    const [searchErrorMessage, setSearchErrorMessage] = useState('');

    const [friendTab, setFriendTab] = useState(true);

    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const selectedUserId = selectedUser?.user_id;
    const show = (selectedItem: User) => {
        setVisible(true);
        setSelectedUser(selectedItem);
    };
    const hide = () => {
        setVisible(false);
        setSelectedUser(null);
    };

    //const voor validatie
    const [searchError, setSearchError] = useState(false);

    const searchFriend = () => {
        // Validatie/foutmelding
        let hasErrors = false;

        if (search == '') {
            hasErrors = true;
            setSearchError(true);
        } else {
            setSearchError(false);
        }

        if (hasErrors) {
            setSearchUsers([]);
            return;
        }

        const payload = {
            currentUser,
            search,
        };
        console.log('frontend: '+payload);
        fetch(`${API_URL}/searchFriend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken}`,
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                console.log('Response:', jsonRes);
                if (res.status !== 200) {
                    setSearchErrorMessage(jsonRes.message);
                } else {
                    setSearchUsers(jsonRes);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const sendFriendRequest = () => {
        const payload = {
          currentUser,
          selectedUserId,
        };
        fetch(`${API_URL}/sendFriendRequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken}`,
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
              }
            } catch (err) {
              console.log(err);
            }
          })
          .catch(err => {
            console.log(err);
          });
    };

  return (
    <View style={styles.container}>
        <View style={styles.optionBar}>
            <TouchableOpacity onPress={() => {setFriendTab(true)}} style={{
            borderBottomWidth: friendTab ? 2 : 0,
            borderBottomColor: friendTab ? '#7D8DF6' : 'transparent',
            }}>
            <Text style={{ color: friendTab ? '#7D8DF6' : 'black' }}>Mijn vrienden</Text>
            </TouchableOpacity> 
            <TouchableOpacity onPress={() => {setFriendTab(false)}} style={{
            borderBottomWidth: !friendTab ? 2 : 0,
            borderBottomColor: !friendTab ? '#7D8DF6' : 'transparent',
            }}>
            <Text style={{ color: !friendTab ? '#7D8DF6' : 'black' }}>Zoek</Text>
            </TouchableOpacity>
        </View>

        {friendTab ? (
        <View style={styles.VriendenContainer}>
        </View>
        ) : (
        <View style={styles.zoekContainer}>
            <View style={styles.searchbarContainer}>
            <TextInput style={styles.searchBar} placeholder="Zoek" autoCapitalize="none" onChangeText={(text) => setSearch(text)} value={search} clearButtonMode='always'></TextInput>
            <TouchableOpacity onPress={() => {searchFriend()}}>
            <FontAwesome name="search" size={25} color='#7D8DF6' style={{marginLeft:10}}/>
            </TouchableOpacity>
            </View>
            
            {searchError && <Text style={styles.errorText}>Vul de naam in van een gebruiker</Text>}

            <FlatList
                data={searchUsers} // Array van gebruikers die je hebt ontvangen van searchFriend
                keyExtractor={(item) => item.user_id.toString()} // Unieke sleutel voor elk item
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => show(item)}>
                        <View style={styles.userContainer}>
                            <Image source={require('../assets/images/logo.png')} style={styles.image} resizeMode='contain'/>
                            <View style={styles.userText}>
                                <Text style={{fontSize:16}}>{item.userName}</Text>
                                {/* <Text>{item.fullName}</Text> */}
                                {/* <Text style={{marginTop:8, fontSize:16}}>{item.city}</Text> */}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
        )}

        <Modal visible={visible} animationType="fade" onRequestClose={hide} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <TouchableOpacity onPress={hide}>
                        <FontAwesome name="close" size={25} color='black'/>
                    </TouchableOpacity>
                    
                    {selectedUser && (
                            <View>
                                <Text>{selectedUser.userName}</Text>
                                <Text>{selectedUser.fullName}</Text>
                                <Text>{selectedUser.city}</Text>
                            </View>
                    )}

                    <TouchableOpacity onPress={() => sendFriendRequest()}>
                        <Text>Toevoegen als vriend</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        width:'100%',
        height:'100%',
    },
    optionBar: {
        width:'100%',
        height:50,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    VriendenContainer: {
        backgroundColor:'red',
        height:'auto',
        width:'100%',
    },
    zoekContainer: {
        height:'100%',
        width:'100%',
    },
    searchbarContainer: {
        width:'100%',
        height:50,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    searchBar: {
        width:'85%',
        height:40,
        borderWidth:1,
        borderColor:'#7D8DF6',
        padding:8,
    },
    userContainer: {
        height:100,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'lightgrey',
    },
    userText: {
        height:'100%',
        width:'70%',
        justifyContent:'center',
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
    image: {
        width:60,
        height:60,
        borderRadius:50,
        backgroundColor:'#555FA3',
        marginHorizontal:16,
    },
    errorText: {
        color:'red',
        //textAlign:'center'
    },
});