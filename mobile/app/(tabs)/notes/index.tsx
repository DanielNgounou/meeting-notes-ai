import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getRecentMeetings, RecentMeeting } from '@/src/database/meetingQueries';
import { Ionicons } from '@expo/vector-icons';
import { getEnergy } from 'react-native-reanimated/lib/typescript/animation/spring';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getGroupsWithCount, GroupWithCount } from '@/src/database/groupQueries';


export default function NotesHome() {
  const [recent, setRecent] = useState<RecentMeeting[]>([]);
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<RecentMeeting[]>([]);
  const [view, setView] = useState<'dashboard' | 'groups'>('dashboard');


  //Reloads the information in the app
  useFocusEffect(
    useCallback(() => {
        loadRecent();
    }, [])
  );

  //Load Search results when typing
    useEffect(() => {
    if (searchText.trim().length === 0) {
        setSearchResults([]);
        return;
    }

    const search = async () => {
        const data = await getRecentMeetings(searchText);
        setSearchResults(data);
    };

    search();
    }, [searchText]);

    // Importing the group query + type
    const [groups, setGroups] = useState<GroupWithCount[]>([]);

    //Load groups when switching to "groups" view

    useEffect(() => {
        if (view === 'groups') {
            loadGroups();
        }
        }, [view]);

        const loadGroups = async () => {
        const data = await getGroupsWithCount();
        setGroups(data);
    };







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
          placeholderTextColor={"#999"}
          onChangeText={setSearchText}
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      {/* 🔍 SEARCH MODE */}
        {searchText.trim().length > 0 && (
        <>
            {searchResults.length === 0 ? (
            <Text
                style={{
                color: '#999',
                textAlign: 'center',
                marginTop: 20,
                fontSize: 14,
                }}
            >
                No recordings found.
            </Text>
            ) : (
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                <TouchableOpacity
                    style={{
                    backgroundColor: '#F4F4F4',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 12,
                    }}
                >
                    <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontWeight: '700', fontSize: 15 }}
                    >
                    {item.title}
                    </Text>

                    <Text style={{ color: '#777', marginTop: 4, fontSize: 13 }}>
                    {item.group_name} ·{' '}
                    {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
                )}
            />
            )}
        </>
        )}


        {searchText.length === 0 && view === 'dashboard' && (
        <>
            {/* Recent Meetings */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Recent Meetings Notes
            </Text>

            {recent.length === 0 ? (
            <View
                style={{
                height: 90,
                backgroundColor: '#F4F4F4',
                borderRadius: 14,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
                }}
            >
                <Text style={{ color: '#777', textAlign: 'center', fontSize: 13 }}>
                Your recent recordings will be present over here.
                </Text>
            </View>
            ) : (
            <View style={{ height: 110 }}>
                <FlatList
                horizontal
                data={recent}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    style={{
                        backgroundColor: '#e6e6e6',
                        borderRadius: 14,
                        padding: 12,
                        marginRight: 12,
                        width: 160,
                        height: 90,
                        justifyContent: 'center',
                    }}
                    >
                    <Text numberOfLines={2} style={{ fontWeight: '600' }}>
                        {item.title}
                    </Text>

                    <Text style={{ color: '#777', marginTop: 4, fontSize: 12 }}>
                        {new Date(item.created_at).toDateString()}
                    </Text>
                    </TouchableOpacity>
                )}
                />
            </View>
            )}

            {/* 👇 THIS is the trigger */}
            <TouchableOpacity
            onPress={() => setView('groups')}
            style={{ marginTop: 6 }}
            >
            <Text style={{ fontWeight: '600' }}>View all notes</Text>
            </TouchableOpacity>

            {/* Tasks */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 24 }}>
            Task to be achieved
            </Text>

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
        </>
        )}


        {searchText.length === 0 && view === 'groups' && (
        <>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
            All meetings
            </Text>

            <Text style={{ color: '#888', marginBottom: 16 }}>
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
        </>
        )}


    </View>
  );
}
