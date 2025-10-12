import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const MapScreen = ({ route }) => {
  // Retrieve parameters passed from the form screen
  const { airport, departure, ident } = route.params;

  // Build the URL with query parameters
  const mapUrl = `http://10.0.0.222:5173/?airport=${encodeURIComponent(airport)}&departure=${encodeURIComponent(departure)}&ident=${encodeURIComponent(ident)}`;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: mapUrl }} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});

export default MapScreen;
