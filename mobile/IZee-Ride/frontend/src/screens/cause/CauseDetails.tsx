import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { CauseApi } from '../../api/endpoints';

export default function CauseDetails({ route, navigation }: any){
  const { id } = route.params || {};
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('0');

  useEffect(()=>{
    // If id is provided, fetch details (omitted for brevity)
  },[id]);

  const onSave = async () => {
    try {
      await CauseApi.create({ title, amountRequired: Number(amount) });
      Alert.alert('Saved', 'Cause saved successfully');
      navigation.goBack();
    } catch (e:any) {
      Alert.alert('Error', e?.response?.data?.message ?? e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Cause Details" />
      <TextField label="Title" value={title} onChangeText={setTitle} />
      <TextField label="Amount required (NGN)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <PrimaryButton title="Save Cause" onPress={onSave} />
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


