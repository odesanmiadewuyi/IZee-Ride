import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';

export default function Onboarding3({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={{ uri: 'https://dummyimage.com/240x240/EEF/2F62F0&text=Illustration' }} style={styles.image} />
        <Text style={styles.title}>Welcome to Leftover</Text>
        <Text style={styles.subtitle}>Say leftover, help someone</Text>
      </View>
      <PrimaryButton title="Next" onPress={() => navigation.navigate('LoginBVN')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 40,
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
});
