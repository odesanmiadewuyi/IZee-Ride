import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
};

export default function SuccessModal({ visible, title, message, onClose, actionLabel = 'OK', onAction }: Props) {
  if (!visible) return null;
  return (
    <View className="absolute inset-0 bg-black/40 items-center justify-center px-6">
      <View className="w-full rounded-2xl bg-white p-6">
        <TouchableOpacity accessibilityLabel="Close" onPress={onClose} className="absolute right-4 top-4 h-8 w-8 items-center justify-center">
          <Text className="text-2xl text-gray-400">×</Text>
        </TouchableOpacity>
        <View className="items-center mt-2">
          <View className="h-20 w-20 rounded-full bg-accent/30 items-center justify-center">
            <View className="h-10 w-10 rounded-full bg-accent/70 items-center justify-center">
              <Text className="text-white text-xl">✓</Text>
            </View>
          </View>
          <Text className="mt-4 text-xl font-semibold text-primary">{title}</Text>
          <Text className="mt-3 text-center text-gray-700">
            {message}
          </Text>
          <TouchableOpacity onPress={onAction || onClose} className="mt-6 bg-primary rounded-xl px-5 py-3">
            <Text className="text-white font-medium">{actionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

