import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { apiFetch } from '../config/api';

type Message = {
  id: number;
  user_id: number | null;
  content: string;
  created_at?: string;
  user_name?: string;
};

export default function CommunityScreen() {
  const [data, setData] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Message[] }>(`/api/community`);
      setData(res.data || []);
    } catch (e) {
      console.warn('Failed to load messages', e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-gray-900 font-medium">{item.user_name || 'Anonymous'}</Text>
            <Text className="text-gray-700 mt-1">{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-gray-500">No messages yet.</Text>
          </View>
        ) : null}
      />
    </View>
  );
}

