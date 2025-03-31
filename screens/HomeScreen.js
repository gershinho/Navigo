import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const SimpleForm = () => {
  const [formData, setFormData] = useState({ //formData holds form data, setFormData updates formData
    departure: '2025-03-29',
    airport: 'ORD', // initial states of all data
    ident: 'SKW5999',
  });

  const navigation = useNavigation();

  const handleChange = (field, value) => { // field = name of input(name, airport, gatenum), value = val entered
  
    setFormData(prevData => ({ 
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log('Form submitted:', formData);
    try {
      const response = await fetch('http://10.0.0.56:5000/get_flightData', {
        method: 'POST',
        headers: {
          
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log('Server response:', result);
      navigation.navigate('Map', formData);
    
    } catch (error) {
      console.error('Error submitting form:', error);
    }
      
  };

  return (

    <View style={styles.container}>
      <Text style={styles.label}>departure:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter departure"
        value={formData.departure}
        onChangeText={value => handleChange('departure', value)}
      />

      <Text style={styles.label}>airport:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter airport"
        value={formData.airport}
        onChangeText={value => handleChange('airport', value)}
      />

      <Text style={styles.label}>ident Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ident"
        value={formData.ident}
        onChangeText={value => handleChange('ident', value)}
       
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} color="#4CAF50" />
      </View>
     
    </View>
      

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SimpleForm;
