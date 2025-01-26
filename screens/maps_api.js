// Display.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import useLocategeo from '../flightinfo/geolocate'; 

const Display = ({ route }) => {
  const { directionsData} = route.params ?? {}; //route.params holds data passed when you navigate to this screen
  const { location, getLocation } = useLocategeo();

  useEffect(() => {

    getLocation();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Your location:{' '}
        {location ? `${location.latitude}, ${location.longitude}` : 'Loading...'}
      </Text>
      <Text>
        Directions: {directionsData ? JSON.stringify(directionsData) : 'No directions data'}
      </Text>
    </View>
  );
};

export default Display;
