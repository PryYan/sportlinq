import {View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Animated,Dimensions} from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';
import RNPickerSelect from 'react-native-picker-select';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


interface Friend {
    user_id: number;
    userName: string;
}

interface LocationType {
    location_id: number;
    locationName: string;
    description: string;
    sport: string;
    street: string;
    city: string;
    zipcode: string;
    image: string;
}

const API_URL = 'http://localhost:5000';
//const API_URL = 'http://{ HIER JOUW IP ADRES }:5000';

const NewSession = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(isFocused);

    const { useToken, setToken, userObject, setUserObject, locations, setLocations } = useAuth();
    const currentUser = userObject.user_id;

    const [listOfFriends, setListOfFriends] = useState<Friend[]>([]);

    useEffect(() => {
        setVisible(isFocused);
        
        // om direct alle friends te krijgen
        getFriends();
    }, [isFocused, locations]);

    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
        navigation.goBack();
    };

    // Functie om de datum te formatteren
    const formatDateCustomOrder = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };
        // Gebruik de locale en opties om de datum te formatteren
        const formattedDate = date.toLocaleDateString('nl-NL', options);

        // Handmatig hoofdletters toevoegen aan de eerste letter van de dag en de maand
        const formattedDateWithCaps = formattedDate.replace(
          /\b\w/g,
          (char) => char.toUpperCase()
        );
      
        const dateParts = formattedDateWithCaps.split(' ');
      
        // Bepaal de aangepaste volgorde van de elementen
        const customOrder = [0, 1, 2, 4, 5];
      
        // Creëer een nieuwe geformatteerde datumstring met aangepaste volgorde
        const customFormattedDate = customOrder.map((index) => {
            if (index === 4) {
              return dateParts[index].toLowerCase();
            }
            return dateParts[index];
        }).join(' ');

        const customFormattedDateWithHour = customFormattedDate + ' uur';
      
        return customFormattedDateWithHour;
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedFriendID, setSelectedFriendID] = useState<number | null>(null);
    const [selectedLocationID, setSelectedLocationID] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };

    const handleFriendChange = (value: number) => {
        console.log('gekozen vriend waarde: ' + value);
        setSelectedFriendID(value);
    };
    
    const handleLocationChange = (value: number) => {
        console.log('gekozen locatie waarde: ' + value);
        setSelectedLocationID(value);
    };

    const handleDateConfirm = (date: Date) => {
        const formattedDate = formatDateCustomOrder(date);
        setFormattedDate(formattedDate);
        console.log(formattedDate);
        
        //setSelectedDate(date.toISOString());
        setSelectedDate(date);
        hideDatePicker();
    };

    // validatie const
    const [friendError, setFriendError] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [oldDateError, setOldDateError] = useState(false);

    // deze dus veranderen wanneer er een friend table is, user_id
    // in query weghalen etc, want door gebruik alle users, moet ik
    // mezelf van die lijst uitsluiten
    const getFriends = () => {
        const currentUserID = userObject.user_id;
        fetch(`${API_URL}/getFriends?user_id=${currentUserID}`, {
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
                    setListOfFriends(jsonRes);
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

    const sendSessionRequest = () => {
        // Validatie/foutmelding
        let hasErrors = false;

        if (!selectedFriendID) {
            hasErrors = true;
            setFriendError(true);
        } else {
            setFriendError(false);
        }

        if (!selectedLocationID) {
            hasErrors = true;
            setLocationError(true);
        } else {
            setLocationError(false);
        }

        if (selectedDate) {
            const currentDate = new Date();
            if (selectedDate < currentDate) {
                hasErrors = true;
                setDateError(true);
            } else {
                setDateError(false);
            }
        }

        if (hasErrors) {
            return;
        }

        const payload = {
          currentUser,
          selectedFriendID,
          selectedLocationID,
          selectedDate
        };
        fetch(`${API_URL}/sendSessionRequest`, {
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
        <Modal visible={visible} animationType="slide" onRequestClose={hide} transparent>  
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={hide}>
                    <FontAwesome name="close" size={25} color='black'/>
                </TouchableOpacity>
                <View style={styles.modal}>
                
                <RNPickerSelect
                items={listOfFriends.map(friend => ({ label: friend.userName, value: friend.user_id }))}
                placeholder={{ label: 'Kies een vriend', value: '' }}
                onValueChange={handleFriendChange}
                />
                {friendError && <Text style={styles.errorText}>Selecteer een vriend</Text>}

                <RNPickerSelect
                items={(locations as LocationType[]).map(location => ({ label: location.locationName, value: location.location_id }))}
                placeholder={{ label: 'Kies een locatie', value: '' }}
                onValueChange={handleLocationChange}
                />
                {locationError && <Text style={styles.errorText}>Selecteer een locatie</Text>}

                <TouchableOpacity onPress={showDatePicker}>
                <Text>Kies een datum</Text>
                </TouchableOpacity>
                <Text>{formattedDate}</Text>
                {dateError && <Text style={styles.errorText}>Selecteer een datum</Text>}

                <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                />
                </View>

                <TouchableOpacity onPress={() => sendSessionRequest()}>
                    <Text>Bevestig</Text>
                </TouchableOpacity>
            </View>
        </Modal>
        </View>
    );
}

export default NewSession

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
    },
    modalContainer: {
        flex:1,
        width:'100%',
        height:'100%',
        backgroundColor:'#7D8DF6',
        justifyContent:'center',
        alignItems:'center',
    },
    modal: {
        width:300,
        height:400,
        backgroundColor:'#6C79CF',
    },
    errorText: {
        color:'red',
        //textAlign:'center'
    },
});