import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { WalletApi } from '../../api/endpoints';

export default function LoadWallet({ navigation }: any){
  const [amount, setAmount] = useState('50');
  const onLoad = async () => {
    await WalletApi.loadByTransfer(Number(amount));
    navigation.navigate('Receipt', { txId: 'load-' + Date.now() });
  };
  return (
    <View style={styles.container}>
      <Header title="Load wallet by bank transfer" />
      <TextField label="Amount (USD)" value={amount} onChangeText={setAmount} keyboardType="numeric"/>
      <PrimaryButton title="Generate transfer details" onPress={onLoad} />
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
