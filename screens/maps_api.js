import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const useLocategeo = () => {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      const response = await axios.get('http://10.0.0.222:5000/get_location');
      setLocation(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return { location, getLocation };
};

// Display component that uses the custom hook to show location on screen
const Display = () => {
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
    </View>
  );
};

export default Display;
