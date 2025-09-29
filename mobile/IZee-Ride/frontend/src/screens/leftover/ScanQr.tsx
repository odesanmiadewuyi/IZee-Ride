import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';

export default function ScanQr({ navigation, route }: any){
  // Placeholder for QR scanning
  Alert.alert('QR Scanner', 'Camera functionality not implemented yet. Use manual input in SendLeftover.');
  navigation.goBack();
  return (
    <View style={styles.container}>
      <Text>QR Scanner Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
