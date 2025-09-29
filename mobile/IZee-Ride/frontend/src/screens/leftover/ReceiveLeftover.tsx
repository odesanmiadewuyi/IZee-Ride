import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import QRCode from 'react-native-qrcode-svg';
import Header from '../../components/Header';

export default function ReceiveLeftover({ navigation }: any){
  const payload = JSON.stringify({ type:'receive', causeId:'demo-1' });
  return (
    <View style={styles.container}>
      <Header title="Scan to receive" />
      <View style={styles.qrContainer}>
        <QRCode value={payload} size={220} />
        <Text style={styles.instruction}>Show this code to the sender</Text>
      </View>
      <PrimaryButton title="Back to Home" onPress={()=>navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    color: '#666',
    marginTop: 16,
  },
});
