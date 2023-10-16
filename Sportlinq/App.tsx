import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import TabLayout from './app/screens/(tabs)/_layout';
import Welcome from './app/screens/Welcome';
import Inloggen from './app/screens/Inloggen';
import Registreren from './app/screens/Registreren';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const OutsideStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();


function InsideLayout() {
  return (
    <InsideStack.Navigator initialRouteName='tabs' screenOptions={{ headerShown: false }}>
      <InsideStack.Screen name='tabs' component={TabLayout} />
    </InsideStack.Navigator>
  );
}

function OutsideLayout() {
  return (
    <OutsideStack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
      <OutsideStack.Screen name='Welcome' component={Welcome} />
      <OutsideStack.Screen name='Inloggen' component={Inloggen} 
      options={{ 
        headerShown: true, 
        headerTitle:'',
        headerStyle: {
          backgroundColor: '#7D8DF6',
          //borderBottomColor: 'transparent' //GEEFT TS ERROR, MAAR WERKT
        },
        headerTintColor: 'white',
        headerShadowVisible: false,
      }} />
      <OutsideStack.Screen name='Registreren' component={Registreren} 
      options={{ 
        headerShown: true, 
        headerTitle:'',
        headerStyle: {
          backgroundColor: '#7D8DF6',
        },
        headerTintColor: 'white',
        headerShadowVisible: false,
      }}/>
    </OutsideStack.Navigator>
  );
} //<OutsideStack.Screen name='Login' component={Login} options={{ headerShown: true}} />

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Outside'}>
        {user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{headerShown: false }} />
          ) : (
          <Stack.Screen name='Outside' component={OutsideLayout} options={{headerShown: false }} />
          )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
