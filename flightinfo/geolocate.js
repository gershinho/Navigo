import React, { useState} from 'react';
import axios from 'axios';

//need to use useState hook to update the response from getLocation
const useLocategeo = () => {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      const response = await axios.get('http://10.0.0.181:5000/get_location');
      setLocation(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {location, getLocation};
  
};

export default useLocategeo;




