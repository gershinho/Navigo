import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const languageMap = {
  en: {
    title: 'Navigo',
    departure: 'Departure',
    airport: 'Airport',
    ident: 'Ident Number',
    language: 'Language',
    location: "O'Hare Airport",
  },
  es: {
    title: 'Navegar',
    departure: 'Salida',
    airport: 'Aeropuerto',
    ident: 'Número de vuelo',
    language: 'Idioma',
    location: 'Aeropuerto O\'Hare',
  },
  fr: {
    title: 'Naviguer',
    departure: 'Départ',
    airport: 'Aéroport',
    ident: 'Numéro d\'identification',
    language: 'Langue',
    location: 'Aéroport O\'Hare',
  },
  de: {
    title: 'Navigieren',
    departure: 'Abflug',
    airport: 'Flughafen',
    ident: 'Kennnummer',
    language: 'Sprache',
    location: 'O\'Hare Flughafen',
  },
  hi: {
    title: 'नेविगो',
    departure: 'प्रस्थान',
    airport: 'हवाई अड्डा',
    ident: 'उड़ान संख्या',
    language: 'भाषा',
    location: 'ओ\'हेयर हवाई अड्डा',
  },
  gu: {
    title: 'નૅવિગો',
    departure: 'પ્રસ્થાન',
    airport: 'વિમાનમથક',
    ident: 'ઉડાન નંબર',
    language: 'ભાષા',
    location: 'ઓહેર એરપોર્ટ',
  },
};

const languageList = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
  { code: 'gu', label: 'Gujarati' },
];

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    departure: '2025-03-29',
    airport: 'ORD',
    ident: 'SKW5999',
  });

  const [language, setLanguage] = useState('en');
  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const t = languageMap[language]; // current language translations

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log('Form submitted:', formData);
    try {
      const response = await fetch('http://10.0.0.222:5000/get_flightData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <View style={styles.screenContainer}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <Text style={styles.airportText}>
            <Text style={styles.iconStyle}>📍</Text> {t.location}
          </Text>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.languageText}>
              {t.language} <Text style={styles.iconStyle}>🌐</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={languageList}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => {
                    setLanguage(item.code);
                    setShowModal(false);
                  }}
                >
                  <Text style={styles.languageOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{t.title}</Text>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>{t.departure}:</Text>
          <TextInput
            style={styles.styledInput}
            value={formData.departure}
            onChangeText={(value) => handleChange('departure', value)}
          />

          <Text style={styles.formLabel}>{t.airport}:</Text>
          <TextInput
            style={styles.styledInput}
            value={formData.airport}
            onChangeText={(value) => handleChange('airport', value)}
          />

          <Text style={styles.formLabel}>{t.ident}:</Text>
          <TextInput
            style={styles.styledInput}
            value={formData.ident}
            onChangeText={(value) => handleChange('ident', value)}
          />

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
    backgroundColor: '#FCE2C8',
    paddingHorizontal: 20,
  },
  headerWrapper: {
    marginTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  airportText: {
    fontSize: 18,
    color: '#C56B2E',
    fontWeight: '600',
  },
  iconStyle: {
    fontSize: 18,
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 42,
    color: '#D87E3B',
    fontWeight: '700',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formLabel: {
    width: '80%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8C4B1F',
    marginBottom: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  languageOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  languageOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SimpleForm;
