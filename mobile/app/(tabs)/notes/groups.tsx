import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getGroupsWithCount, GroupWithCount } from '@/src/database/groupQueries';

export default function GroupsScreen() {
  const [groups, setGroups] = useState<GroupWithCount[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const data = await getGroupsWithCount();
    setGroups(data);
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 48 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Notes</Text>
      <Text style={{ color: '#888', marginBottom: 20 }}>
        Click on a group to view its recordings
      </Text>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/notes/group/${item.id}`)}
            style={{
              backgroundColor: '#F4F4F4',
              borderRadius: 14,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: '700', fontSize: 16 }}>
              {item.name}
            </Text>
            <Text style={{ color: '#777', marginTop: 4 }}>
              {item.recordings} recordings
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
