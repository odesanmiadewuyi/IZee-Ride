import React from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { apiFetch } from '../config/api';

type Order = { id: number; status: string; total_amount: number; delivery_address?: string };

export default function VendorOrders() {
  const [data, setData] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Order[] }>(`/api/part-orders/vendor`);
      setData(res.data || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const setStatus = async (id: number, status: string) => {
    try {
      await apiFetch(`/api/part-orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      Alert.alert('Updated', `Order ${id} -> ${status}`);
      load();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-base font-semibold">Order #{item.id} • ₦{item.total_amount}</Text>
            <Text className="text-gray-600">{item.delivery_address || 'No delivery address'}</Text>
            <Text className="text-gray-700 mt-1">Status: {item.status}</Text>
            <View className="flex-row mt-2 gap-2">
              {['accepted','declined','shipped','delivered','cancelled'].map(s => (
                <TouchableOpacity key={s} onPress={() => setStatus(item.id, s)} className="bg-primary/90 px-3 py-1 rounded">
                  <Text className="text-white text-xs capitalize">{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

