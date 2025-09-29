import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SuccessModal from '../components/SuccessModal';
import { RewardsApi } from '../api/client';

export default function MilepointScreen() {
  const [points, setPoints] = useState<number>(5000);
  const [tickets, setTickets] = useState<any[]>([]);
  const [claimedVisible, setClaimedVisible] = useState(false);
  const token = undefined; // wire to auth
  const nav = useNavigation<any>();

  useEffect(() => {
    RewardsApi.me(token).then((r: any) => setPoints(Number(r?.data?.points || 0))).catch(() => {});
    RewardsApi.tickets().then((r: any) => setTickets(r.data || [])).catch(() => {});
  }, []);

  const claim = async (id: number) => {
    try {
      await RewardsApi.claim(id, token);
      setClaimedVisible(true);
    } catch (e: any) {
      Alert.alert('Claim failed', e.message);
    }
  };

  return (
    <View className="px-5 pt-4 pb-6">
      <View className="mt-6">
        <Text className="text-base font-semibold text-primary">Bonus & Milepoint</Text>
        <View className="mt-4 p-4 rounded-xl border border-gray-200">
          <Text className="text-gray-600">Total Mile point</Text>
          <Text className="text-2xl font-semibold mt-2">N {points.toLocaleString()}</Text>
        </View>
        <Text className="mt-6 text-gray-500">Mile point are strictly for event ticket purchase.</Text>
      </View>

      <Section title="Ticket within N 5,000" items={tickets.filter(t => t.price_points <= 5000)} onClaim={claim} />
      <Section title="Ticket within N 10,000" items={tickets.filter(t => t.price_points > 5000)} onClaim={claim} />

      <SuccessModal
        visible={claimedVisible}
        title="Claimed"
        message={'Thank for choosing the IZEE way.\n\nYour selected ticket has been saved and is being processed, you will be contacted with the details for the event.'}
        actionLabel="Return to Home"
        onClose={() => setClaimedVisible(false)}
        onAction={() => { setClaimedVisible(false); nav.navigate('Home'); }}
      />
    </View>
  );
}

function Section({ title, items, onClaim }: { title: string; items: any[]; onClaim: (id:number)=>void }) {
  return (
    <View className="mt-6">
      <Text className="font-semibold text-base">{title}</Text>
      <View className="flex-row flex-wrap -mx-2 mt-3">
        {items.map((t) => (
          <View key={t.id} className="w-1/2 px-2 mb-4">
            <View className="rounded-xl overflow-hidden border border-gray-200">
              {t.image_url ? <Image source={{ uri: t.image_url }} style={{ width: '100%', height: 110 }} /> : <View className="h-28 bg-gray-200" />}
              <View className="p-3">
                <Text numberOfLines={1} className="font-medium">{t.name}</Text>
                <Text className="text-gray-600 mt-1">N {Number(t.price_points).toLocaleString()}</Text>
                <TouchableOpacity onPress={() => onClaim(t.id)} className="mt-2 bg-primary rounded-lg py-2 items-center">
                  <Text className="text-white">Claim</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
