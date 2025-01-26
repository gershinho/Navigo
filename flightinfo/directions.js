import React, { useState} from 'react';
import axios from 'axios';

const useDirections = () => {
    const [directions, setDirections] = useState(null);
  
    const getDirections = async (terminal) => {
      try {
        const response = await axios.get('http://10.0.0.181:5000/directions');
        setDirections(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return {directions, getDirections};
    
  };
  
  export default useDirections;