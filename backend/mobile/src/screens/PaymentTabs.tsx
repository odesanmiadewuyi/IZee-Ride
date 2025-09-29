import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Segmented from '../components/Segmented';
import PaymentFlow from './PaymentFlow';
import CommissionPayment from './CommissionPayment';
import MilepointScreen from './MilepointScreen';

type TopTab = 'payment' | 'bonus';
type PaymentSub = 'service' | 'commission';

export default function PaymentTabs() {
  const [top, setTop] = useState<TopTab>('payment');
  const [which, setWhich] = useState<PaymentSub>('service');

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-10" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="items-center">
        <Text className="text-primary font-bold text-lg">Express Delivery</Text>
      </View>

      <View className="mt-4">
        <Segmented
          options={[
            { key: 'payment', label: 'Payment' },
            { key: 'bonus', label: 'Bonus & Milepoint' },
          ]}
          value={top}
          onChange={(k) => setTop(k as TopTab)}
        />
      </View>

      {top === 'payment' ? (
        <View className="mt-4">
          <Segmented
            options={[
              { key: 'service', label: 'Service Charge' },
              { key: 'commission', label: 'Commission' },
            ]}
            value={which}
            onChange={(k) => setWhich(k as PaymentSub)}
          />
          <View className="mt-2" />
          {which === 'service' ? <PaymentFlow /> : <CommissionPayment />}
        </View>
      ) : (
        <MilepointScreen />
      )}
    </ScrollView>
  );
}

