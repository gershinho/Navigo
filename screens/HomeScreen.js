import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const SimpleForm = () => {
  const [formData, setFormData] = useState({ //formData holds form data, setFormData updates formData
    terminal: '',
    airline: '', // initial states of all data
    gateNumber: '',
  });

  const navigation = useNavigation();

  const handleChange = (field, value) => { // field = name of input(name, airport, gatenum), value = val entered
  
    setFormData(prevData => ({ //update form in specific field
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  
    // Extract the terminal from the form data
    const { terminal } = formData;
    console.log(terminal);
  
    const DIRECTIONS_URL = `http://10.0.0.181:5000/directions?terminal=${encodeURIComponent(terminal)}`;

    fetch(DIRECTIONS_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
          navigation.navigate("API", { directionsData: data});
      })
      .catch(error => {
        console.error("Error fetching directions:", error);
      });
  };

  return (

    <View style={styles.container}>
      <Text style={styles.label}>Terminal:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter terminal"
        value={formData.terminal}
        onChangeText={value => handleChange('terminal', value)}
      />

      <Text style={styles.label}>Airline:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter airline"
        value={formData.airport}
        onChangeText={value => handleChange('airline', value)}
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
