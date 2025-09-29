import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

type Props = {
  label?: string;
} & TextInputProps;

export default function TextField({ label, style, ...rest }: Props){
  return (
    <View className="mb-4">
      {label ? <Text className="text-gray-800 mb-2">{label}</Text> : null}
      <TextInput
        className="border border-gray-300 rounded-2xl p-4 bg-white"
        style={style}
        {...rest}
      />
    </View>
  );
}
