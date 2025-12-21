import { View, Text, TouchableOpacity, FlatList } from 'react-native';
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
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>
        All meetings
      </Text>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/notes/groups/${item.id}`)
            }
            style={{
              backgroundColor: '#F3F3F3',
              borderRadius: 14,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
              {item.name}
            </Text>
            <Text style={{ color: '#666', marginTop: 4 }}>
              {item.count} recording{item.count !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
