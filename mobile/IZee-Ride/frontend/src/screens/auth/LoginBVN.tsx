import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthApi } from '../../api/endpoints';
import { setToken } from '../../api/token';

export default function LoginBVN({ navigation }: any){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await AuthApi.login({ email: email.trim(), password });
      if (data?.token) {
        await setToken(data.token);
      }
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e: any) {
      Alert.alert('Login failed', e?.response?.data?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize='none'/>
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <PrimaryButton title="Log in" onPress={onLogin} loading={loading}/>
      <Text style={styles.switch} onPress={()=>navigation.navigate('SignUpPhoneSE')}>Create an account</Text>
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
    marginBottom: 24,
  },
  switch: {
    textAlign: 'center',
    marginTop: 24,
    color: '#2F62F0',
  },
});
