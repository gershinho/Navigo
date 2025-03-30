import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    departure: '2025-03-25',
    airport: 'ORD',
    ident: 'SKW5257',
  });

  const navigation = useNavigation();

  // Hide the default navigation header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log('Form submitted:', formData);
    try {
      const response = await fetch('http://192.168.12.149:5000/get_flightData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log('Server response:', result);
      navigation.navigate('API');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <View style={styles.screenContainer}>
      {/* Header positioned near the top, now with increased margin */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <View style={styles.airportContainer}>
            <Text style={styles.airportText}>
              <Text style={styles.iconStyle}>📍</Text> O'Hare Airport
            </Text>
          </View>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageText}>
              Language <Text style={styles.iconStyle}>🌐</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content centered on screen */}
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Navigo</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Departure:</Text>
          <TextInput
            style={styles.styledInput}
            placeholder="Enter departure"
            value={formData.departure}
            onChangeText={(value) => handleChange('departure', value)}
          />

          <Text style={styles.formLabel}>Airport:</Text>
          <TextInput
            style={styles.styledInput}
            placeholder="Enter airport"
            value={formData.airport}
            onChangeText={(value) => handleChange('airport', value)}
          />

          <Text style={styles.formLabel}>Ident Number:</Text>
          <TextInput
            style={styles.styledInput}
            placeholder="Enter ident"
            value={formData.ident}
            onChangeText={(value) => handleChange('ident', value)}
          />

          {/* Submit button styled like the plane button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonIcon}>✈️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FCE2C8', // Peach background
    width: '100%',
    paddingHorizontal: 20,
  },
  headerWrapper: {
    width: '100%',
    // Increase marginTop further to move the header lower
    marginTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  airportContainer: {},
  airportText: {
    fontSize: 18,
    color: '#C56B2E',
    fontWeight: '600',
  },
  languageButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F8C999',
  },
  languageText: {
    color: '#8C4B1F',
    fontWeight: '600',
    fontSize: 16,
  },
  iconStyle: {
    fontSize: 18,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 42,
    color: '#D87E3B',
    fontWeight: '700',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8C4B1F',
    marginBottom: 8,
    width: '80%',
  },
  styledInput: {
    width: '80%',
    backgroundColor: '#F8C999',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 30,
    marginVertical: 10,
    color: '#8C4B1F',
    fontSize: 18,
    fontWeight: '600',
  },
  submitButton: {
    width: 70,
    height: 70,
    backgroundColor: '#D87E3B',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonIcon: {
    fontSize: 28,
    color: '#FFF',
  },
});

export default SimpleForm;
