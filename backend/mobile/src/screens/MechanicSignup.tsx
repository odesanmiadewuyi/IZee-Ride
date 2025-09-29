import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { apiFetch } from '../config/api';

export default function MechanicSignup() {
  const [form, setForm] = React.useState<any>({});
  const onChange = (k: string, v: string) => setForm((s: any) => ({ ...s, [k]: v }));

  const submit = async () => {
    try {
      // Expect user to be logged in; here we only post the mechanic profile
      await apiFetch('/api/mechanics', { method: 'POST', body: JSON.stringify(form) });
      Alert.alert('Success', 'Mechanic profile created');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-semibold mb-4">Mechanic Sign Up</Text>
      {[
        ['name', 'Name'],
        ['company_name', 'Company Name'],
        ['email', 'Email'],
        ['phone', 'Phone'],
        ['state', 'State'],
        ['lga', 'LGA'],
        ['business_address', 'Business Address'],
        ['date_of_birth', 'Date of Birth (YYYY-MM-DD)'],
        ['valid_id', 'Valid ID (text/URL)'],
        ['profile_picture', 'Profile Picture URL'],
      ].map(([k, label]) => (
        <View key={k} className="mb-3">
          <Text className="text-gray-700 mb-1">{label}</Text>
          <TextInput
            className="border border-gray-300 rounded px-3 py-2"
            value={form[k] || ''}
            onChangeText={(v) => onChange(k, v)}
            placeholder={label}
          />
        </View>
      ))}
      <TouchableOpacity onPress={submit} className="bg-primary rounded py-3 mt-2">
        <Text className="text-white text-center font-medium">Create Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

