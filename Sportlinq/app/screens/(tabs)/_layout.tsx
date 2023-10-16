import FontAwesome from '@expo/vector-icons/FontAwesome';
// niks importeren van 'expo-router' anders conflict met @react-navigation
import { Pressable, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import index from './index';
import Sessions from './Sessions';
import NewSession from './NewSession';
import Locations from './Locations';
import Profile from './Profile';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';

const Tab = createBottomTabNavigator();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

interface Routerprops {
  navigation: NavigationProp<any, any>;
}

//<Tab.Navigator screenOptions={{tabBarActiveTintColor: 'grey',}}>
export default function TabLayout({ navigation }: Routerprops) {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: 'grey', tabBarStyle:{backgroundColor:'#7D8DF6'},}}>
      <Tab.Screen
        name="index"
        component={index}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color='white' />,
          tabBarLabelStyle:{color:'white'}
        }}
      />
      <Tab.Screen
        name="Sessions"
        component={Sessions}
        options={{
          title: 'My sessions',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color='white' />,
          tabBarLabelStyle:{color:'white'}
        }}
      />
      <Tab.Screen
        name="NewSession"
        component={NewSession}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color='white' />,
          tabBarLabelStyle:{color:'white'}
        }}
      />
      <Tab.Screen
        name="Locations"
        component={Locations}
        options={{
          title: 'Locations',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color='white' />,
          tabBarLabelStyle:{color:'white'}
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color='white' />,
          tabBarLabelStyle:{color:'white'},
          headerRight: () => (
            <Pressable
              onPress={() => {
                //navigation.navigate('naam pagina')} title=''
                FIREBASE_AUTH.signOut();
              }}
            >
              {({ pressed }) => (
                <FontAwesome
                  name="sign-out"
                  size={25}
                  color='black'
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
    </Tab.Navigator>
  );
}