import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 48, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>Hello, Vanessa</Text>
        <Text style={{ color: '#888', marginTop: 4 }}>
          Welcome to MeetingNotes
        </Text>
      </View>

      {/* Actions */}
      <TouchableOpacity
        onPress={() => router.push('/record/upload')}
        style={cardStyle}
      >
        <Ionicons name="cloud-upload-outline" size={26} color="#000" />
        <Text style={cardTitle}>Upload Audio files</Text>
        <Text style={cardSubtitle}>Upload all audio files</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/record')}
        style={[cardStyle, { marginTop: 16 }]}
      >
        <Ionicons name="mic-outline" size={26} color="#000" />
        <Text style={cardTitle}>Record Audio</Text>
        <Text style={cardSubtitle}>Record with microphone</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- styles ---------- */

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 20,
  borderWidth: 1,
  borderColor: '#E5E5E5',
  alignItems: 'center' as const,
};

const cardTitle = {
  fontSize: 16,
  fontWeight: '600' as const,
  marginTop: 10,
};

const cardSubtitle = {
  fontSize: 13,
  color: '#777',
  marginTop: 4,
};
