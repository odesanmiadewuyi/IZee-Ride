import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ms } from '../lib/dimensions';

export default function PrimaryButton({ title, onPress, loading=false }: { title: string; onPress: ()=>void; loading?: boolean; }){
  return (
    <TouchableOpacity style={[styles.button, { height: ms(56) }]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2F62F0',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
