import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title='' }){
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => nav.goBack()}><Text style={styles.backText}>Back</Text></TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 44 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backText: {
    color: '#2F62F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
