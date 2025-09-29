import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthApi } from '../../api/endpoints';
import { setToken } from '../../api/token';

export default function SignUpPhoneSE({ navigation }: any){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing fields', 'Enter name, email and password.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await AuthApi.register({ name: name.trim(), email: email.trim(), password });
      if (data?.token) {
        await setToken(data.token);
      }
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e:any) {
      Alert.alert('Error', e?.response?.data?.message ?? e.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <TextField label="Full name" value={name} onChangeText={setName} />
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none'/>
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <PrimaryButton title="Sign up" onPress={onSubmit} loading={loading}/>
      <Text style={styles.switch} onPress={()=>navigation.navigate('LoginBVN')}>I already have an account</Text>
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
