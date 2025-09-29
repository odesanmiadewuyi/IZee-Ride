import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

type Props = {
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
};

export default function Segmented({ options, value, onChange }: Props) {
  return (
    <View className="flex-row bg-gray-100 rounded-xl p-1">
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            className={`flex-1 py-2 rounded-lg ${active ? 'bg-white' : ''} items-center`}
          >
            <Text className={`${active ? 'text-primary font-semibold' : 'text-gray-600'}`}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

