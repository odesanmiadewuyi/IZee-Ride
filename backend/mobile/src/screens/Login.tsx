import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { apiFetch, setAuthToken } from '../config/api';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const submit = async () => {
    try {
      const res = await apiFetch<{ user: any; token: string }>(`/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(res.token);
      Alert.alert('Logged in', `Welcome ${res.user?.name || res.user?.email || ''}`);
    } catch (e: any) {
      Alert.alert('Login failed', e?.message || 'Error');
    }
  };

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-semibold mb-4">Login</Text>
      <Text className="text-gray-700 mb-1">Email</Text>
      <TextInput className="border border-gray-300 rounded px-3 py-2 mb-3" value={email} onChangeText={setEmail} />
      <Text className="text-gray-700 mb-1">Password</Text>
      <TextInput className="border border-gray-300 rounded px-3 py-2 mb-3" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity className="bg-primary rounded py-3" onPress={submit}>
        <Text className="text-white text-center font-medium">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

