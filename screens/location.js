import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { WebView } from 'react-native-webview';


const GOOGLE_GEOLOCATION_API_KEY =  'AIzaSyDaTHaEQ1jwYb-FZSwk-NVJgP9c0PzjS7E';

const locategeo = () => {
  const [locationData, setLocationData] = useState(null);

  const getLocation = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_GEOLOCATION_API_KEY}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // A minimal body
          body: JSON.stringify({ considerIp: 'true' }),
        }
      );
  
      // Log the entire raw response (as text) for debugging:
      const text = await response.text();
      console.log('Raw response:', text);
  
      // Then parse the text as JSON
      const data = JSON.parse(text);
      console.log('Parsed response:', data);
  
      // If there's an error field in the data, log it
      if (data.error) {
        console.error('Geolocation API error:', data.error);
        return;
      }
  
      // Otherwise, set the location data
      setLocationData(data);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };
  

  return (
    <View>
      <Button title="Get Location" onPress={getLocation} />
      {locationData && (
        <>
          <Text>Location Data:</Text>
          <Text>Latitude: {locationData.location.lat}</Text>
          <Text>Longitude: {locationData.location.lng}</Text>
          <Text>Accuracy: {locationData.accuracy}</Text>
        </>
      )}
    </View>
  );
};

export default locategeo;