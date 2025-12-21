import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getRecentMeetings, RecentMeeting } from '@/src/database/meetingQueries';
import { Ionicons } from '@expo/vector-icons';
import { getEnergy } from 'react-native-reanimated/lib/typescript/animation/spring';

export default function NotesHome() {
  const [recent, setRecent] = useState<RecentMeeting[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    const data = await getRecentMeetings();
    setRecent(data);
  };

  return (
    <View style={{ marginTop: 48,flex: 1, padding: 20 }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Notes</Text>
      <Text style={{ color: '#888', marginBottom: 16 }}>
        MeetingNotes
      </Text>

      {/* Search */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#e6e6e6ff',
          borderRadius: 20,
          padding: 12,
          marginBottom: 20,
        }}
      >
        <Ionicons name="search" size={18} color="#777" />
        <TextInput
          placeholder="Search past meeting notes here"
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      {/* Recent Meetings */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
        Recent Meetings Notes
      </Text>

      <View style={{ height: 110 }}>
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recent}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingRight: 8 }}
            renderItem={({ item }) => (
            <TouchableOpacity
                style={{
                backgroundColor: '#e6e6e6',
                borderRadius: 14,
                padding: 12,
                marginRight: 12,
                width: 160,
                height: 90,              // 🔑 control card height
                justifyContent: 'center' // 🔑 vertical alignment
                }}
            >
                <Text
                numberOfLines={2}
                style={{ fontWeight: '600' }}
                >
                {item.title}
                </Text>

                <Text
                style={{ color: '#777', marginTop: 4, fontSize: 12 }}
                >
                {new Date(item.created_at).toDateString()}
                </Text>
            </TouchableOpacity>
            )}
        />
        </View>


      {/* View all notes */}
      <TouchableOpacity
        onPress={() => router.push('/notes/groups')}
        style={{ backgroundColor: '#ccccccff',marginTop: 12 }}
      >
        <Text style={{ fontWeight: '600' }}>View all notes</Text>
      </TouchableOpacity>

      {/* Tasks (placeholder for now) */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 24 }}>
        Task to be achieved
      </Text>

      {/* Mock task item */}
      <View
        style={{
          backgroundColor: '#F4F4F4',
          borderRadius: 14,
          padding: 14,
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: '600' }}>Meet Dr Snevans</Text>
        <Text style={{ color: '#777', marginTop: 4 }}>
          17:06 · Today · Life group
        </Text>
      </View>
    </View>
  );
}
