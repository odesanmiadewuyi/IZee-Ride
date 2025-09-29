import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CardsApi, PaymentsApi, WalletApi } from '../api/client';
import SuccessModal from '../components/SuccessModal';

type Method = 'wallet' | 'card' | 'cash';

export default function CommissionPayment() {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>('0');
  const [method, setMethod] = useState<Method>('wallet');
  const [cards, setCards] = useState<any[]>([]);
  const [paidVisible, setPaidVisible] = useState(false);
  const token = undefined; // integrate with auth provider
  const nav = useNavigation<any>();

  useEffect(() => {
    WalletApi.me(token).then((r: any) => setBalance(Number(r?.data?.balance || 0))).catch(() => {});
    CardsApi.list(token).then((r: any) => setCards(r.data || [])).catch(() => {});
  }, []);

  const pay = async () => {
    try {
      const naira = Number(amount || 0);
      await PaymentsApi.commission({ rideId: 1, amount: naira, method }, token);
      setPaidVisible(true);
    } catch (e: any) {
      Alert.alert('Payment failed', e.message);
    }
  };

  const topup = async () => {
    try {
      await WalletApi.topup(100000, token);
      const r: any = await WalletApi.me(token);
      setBalance(Number(r?.data?.balance || 0));
    } catch (e: any) {
      Alert.alert('Top up failed', e.message);
    }
  };

  return (
    <View className="px-5 pt-4 pb-6">
      <View className="mt-6">
        <Text className="text-base font-semibold text-primary">Payment</Text>
        <View className="mt-4 p-4 rounded-xl border border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">Izee Wallet</Text>
            <Text className="text-gray-600">Commission <Text className="text-red-500">- {Number(amount||0).toLocaleString()}</Text></Text>
          </View>
          <View className="flex-row items-center mt-2 justify-between">
            <Text className="text-2xl font-semibold">N {balance.toLocaleString()}</Text>
            <TouchableOpacity onPress={topup} className="px-3 py-2 rounded-lg bg-accent/70"><Text className="text-white">Wallet Top Up</Text></TouchableOpacity>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-gray-600">Add New Card</Text>
          {cards[0] ? (
            <Text className="mt-2">{cards[0].brand} **** {cards[0].last4}  {cards[0].exp_month}/{cards[0].exp_year}</Text>
          ) : (
            <Text className="mt-2 text-gray-500">No cards saved</Text>
          )}
        </View>

        <View className="mt-8 border-t border-dashed border-gray-300 pt-6">
          <Text className="text-center text-gray-700">Pay Commission to Izee Ride</Text>
          <View className="flex-row mt-4 items-center justify-center">
            <TextInput keyboardType="numeric" value={amount} onChangeText={setAmount} className="w-40 text-center text-lg border rounded-lg py-2" />
          </View>
        </View>

        <View className="mt-10">
          <Text className="text-lg font-semibold text-primary mb-4">Select Payment Method</Text>
          <MethodRow label={`Card ${cards[0] ? `•••• ${cards[0].last4}` : ''}`} active={method==='card'} onPress={() => setMethod('card')} />
          <MethodRow label={`Izee Wallet  N ${balance.toLocaleString()}`} active={method==='wallet'} onPress={() => setMethod('wallet')} />
          <MethodRow label={"Cash"} active={method==='cash'} onPress={() => setMethod('cash')} />
        </View>

        <TouchableOpacity onPress={pay} className="mt-8 bg-primary rounded-xl py-3 items-center">
          <Text className="text-white font-semibold">Pay</Text>
        </TouchableOpacity>
      </View>

      <SuccessModal
        visible={paidVisible}
        title="Paid"
        message={'Thank you for using Izee Ride.\n\nYour commission has been debited and paid to IZEE Ride.'}
        actionLabel="Return to Home"
        onClose={() => setPaidVisible(false)}
        onAction={() => { setPaidVisible(false); nav.navigate('Home'); }}
      />
    </View>
  );
}

function MethodRow({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className={`flex-row items-center justify-between px-4 py-3 rounded-xl border mt-2 ${active ? 'border-primary' : 'border-gray-300'}`}>
      <Text className="text-base">{label}</Text>
      <View className={`h-5 w-5 rounded border ${active ? 'bg-primary border-primary' : 'border-gray-400'}`} />
    </TouchableOpacity>
  );
}
