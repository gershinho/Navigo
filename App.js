import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; // a stack is like a pile of cards, where each card representes a screen(push = naviagte forward, pop = go bakcwards through the strack)
import HomeScreen from './screens/HomeScreen';
import APIScreen from './screens/maps_api';
import MapScreen from './screens/MapScreen';

const Stack = createStackNavigator(); // 'stack of screens/cards'

export default function App() {

 

  return ( 
    <NavigationContainer>
      <Stack.Navigator > 
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="APIS" component={APIScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// set homescreen as first screen seen
// stack screen = defining each screen

