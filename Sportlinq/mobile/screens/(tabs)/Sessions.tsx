import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React, { useEffect } from 'react';
import { useAuth } from '../../AuthContext';

interface SessionType {
    id: number;
    requesterUserId: number;
    receiverUserId: number;
    location_id: number;
    date: string;
    locationRelation: {
        locationName: string;
    };
    requesterUser: {
        userName: string;
    };
    receiverUser: {
        userName: string;
    };
}

const API_URL = 'http://localhost:5000';
//const API_URL = 'http://{ HIER JOUW IP ADRES }:5000';

const Sessions = () => {
    const { useToken, setToken, userObject, setUserObject, locations, setLocations } = useAuth();
    const { sessions, setSessions} = useAuth();

    //getlocations uitvoeren wanneer component geladen
    useEffect(() => {
        getSessions();
    }, []);


    const getSessions = () => {
        const currentUserID = userObject.user_id;
        fetch(`${API_URL}/sessions?user_id=${currentUserID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken}`,
            },
        })
        .then(async res => {
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setSessions(jsonRes)
                } else {
                    console.error(jsonRes.message);
                }
            } catch (err) {
                console.error(err);
            }
        })
        .catch(err => {
            console.error(err);
        });
    };

    return (
        <View style={styles.container}>
            {/*<Text style={{marginTop:50, width:'100%'}}></Text>*/}
            <ScrollView style={styles.scrollView}>
                <View style={styles.cardContainer}>
                    {(sessions as SessionType[]).map(session => (
                        <View style={styles.card} key={session.id}>
                            <View style={styles.textContainer}>
                                <Text style={[styles.text,{fontSize:18}]}>{session.locationRelation.locationName}</Text>
                                <Text style={[styles.text,{fontSize:18}]}>{session.requesterUser.userName}</Text>
                                <Text style={[styles.text,{fontSize:18}]}>{session.receiverUser.userName}</Text>
                                <Text style={[styles.text,{fontSize:18}]}>{session.date}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default Sessions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },
    scrollView: {
        width: '100%',
        height: '100%',
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width:'85%',
        height:180,
        backgroundColor:'white',
        marginVertical: 12,
        borderRadius:16,
        overflow:'hidden',
    },
    textContainer: {
        flex:1,
        paddingLeft:18,
        justifyContent:'center',
        position:'relative',
    },
    text: {
        color:'#7D8DF6',
        fontSize:10,
    },
    image: {
        width: 'auto',
        height: '55%',
    },
    headerText:{
        color:'red',
        fontSize:12,
    },
    button: {
        position:'absolute',
        bottom: 14,
        right: 14,
        backgroundColor:'#7D8DF6',
        paddingVertical:4,
        paddingHorizontal:12,
        borderRadius:6,
    }

});