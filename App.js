import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>Navigo</Text>

      {/* Description */}
      <Text style={styles.description}>
        Your guide to navigating the airport with ease!
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Start Navigation" onPress={() => alert('Navigation Started!')} />
        <View style={{ marginTop: 10 }}>
          <Button title="Settings" onPress={() => alert('Settings')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#34495e',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
  },
});
