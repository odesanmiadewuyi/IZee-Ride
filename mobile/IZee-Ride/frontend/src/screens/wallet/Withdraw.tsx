import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { WalletApi } from '../../api/endpoints';

export default function Withdraw({ navigation }: any){
  const [amount, setAmount] = useState('10');
  const onWithdraw = async () => {
    await WalletApi.withdraw(Number(amount));
    navigation.navigate('Receipt', { txId: 'wd-' + Date.now() });
  };
  return (
    <View style={styles.container}>
      <Header title="Withdraw from wallet" />
      <TextField label="Amount (USD)" value={amount} onChangeText={setAmount} keyboardType="numeric"/>
      <PrimaryButton title="Withdraw" onPress={onWithdraw} />
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
