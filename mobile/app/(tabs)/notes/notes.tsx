import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { getRecentMeetings, Meeting } from '@/src/database/meetingQueries';
import { useRouter } from 'expo-router';

export default function NotesScreen() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    const data = await getRecentMeetings(20);
    setMeetings(data);
  };

  const renderItem = ({ item }: { item: Meeting }) => {
    const date = new Date(item.started_at).toLocaleDateString();

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/meeting/[id]',
            params: { id: item.id },
          })
        }
        style={{
          backgroundColor: '#F2F2F2',
          padding: 14,
          borderRadius: 14,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontWeight: '700', fontSize: 16 }}>
          {item.title}
        </Text>

        <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
          {item.group_name} • {date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#FFF' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>
        Notes
      </Text>

      <FlatList
        data={meetings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
