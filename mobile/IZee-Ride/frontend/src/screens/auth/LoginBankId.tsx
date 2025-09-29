import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';

export default function LoginBankId({ navigation }: any){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BankID login unavailable</Text>
      <Text style={styles.subtitle}>
        We currently support email and password authentication. Please continue with the standard login flow.
      </Text>
      <PrimaryButton title="Continue" onPress={() => navigation.navigate('LoginBVN')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
});
