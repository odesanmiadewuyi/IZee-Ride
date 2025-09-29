import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { TxApi } from '../../api/endpoints';

export default function SendLeftover({ navigation }: any){
  const [amount, setAmount] = useState('10');
  const [causeId, setCauseId] = useState('');
  const onSend = async () => {
    const res = await TxApi.sendLeftover({ causeId, amount: Number(amount) });
    navigation.navigate('Receipt', { txId: res.data.id ?? 'temp-id' });
  };
  return (
    <View style={styles.container}>
      <Header title="Send Leftover" />
      <TextField label="Cause ID or Code" value={causeId} onChangeText={setCauseId}/>
      <TextField label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric"/>
      <PrimaryButton title="Scan QR Code" onPress={()=>navigation.navigate('ScanQr', { for: 'send' })} />
      <View style={{ height: 12 }} />
      <PrimaryButton title="Send" onPress={onSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
});

