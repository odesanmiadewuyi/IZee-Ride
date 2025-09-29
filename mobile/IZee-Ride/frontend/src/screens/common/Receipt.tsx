import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Header from '../../components/Header';

export default function Receipt({ route, navigation }: any){
  const { txId } = route.params;
  return (
    <View style={styles.container}>
      <Header title="Receipt" />
      <View style={styles.content}>
        <Text style={styles.title}>Congratulations</Text>
        <Text style={styles.message}>Transaction completed successfully.</Text>
        <Text style={styles.ref}>Reference: {txId}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    color: '#666',
    marginBottom: 16,
  },
  ref: {
    color: '#333',
  },
});
