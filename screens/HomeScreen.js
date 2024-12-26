import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Geolocation from '../flightinfo/geolocation'

const SimpleForm = () => {
  const [formData, setFormData] = useState({ //formData holds form data, setFormData updates formData
    name: '',
    airport: '', // initial states of all data
    gateNumber: '',
  });

  const handleChange = (field, value) => { // field = name of input(name, airport, gatenum), value = val entered
    console.log(`Updating ${field} with value: ${value}`);   
    setFormData(prevData => ({ //update form in specific field
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    Alert.alert('Form Submitted', `Name: ${formData.name}\nAirport: ${formData.airport}\nGate Number: ${formData.gateNumber}`);
   
  };

  return (

    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={formData.name}
        onChangeText={value => handleChange('name', value)}
      />

      <Text style={styles.label}>Airport:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter airport name"
        value={formData.airport}
        onChangeText={value => handleChange('airport', value)}
      />

      <Text style={styles.label}>Gate Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter gate number"
        value={formData.gateNumber}
        onChangeText={value => handleChange('gateNumber', value)}
       
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} color="#4CAF50" />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{JSON.stringify(this.state.location)}</Text>
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
