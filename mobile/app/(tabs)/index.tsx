import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';

import SaveMeetingModal from '../../components/SaveMeetingModal';

import { insertOrGetGroup, getAllGroups } from '@/src/database/groupQueries';
import { insertMeeting } from '@/src/database/meetingQueries';



export default function HomeScreen() {
  const router = useRouter();
  const [uploadedAudioUri, setUploadedAudioUri] = useState<string | null>(null);

  // Component variable
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [meetingName, setMeetingName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);




useEffect(() => {
  if (showSaveModal) {
    getAllGroups().then(setGroups);
  }
}, [showSaveModal]);


    


  /**
   * Handling Upload 
   */

  const handleUploadAudio = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) return;

  const file = result.assets[0];

  // Remove extension for default meeting name
  const cleanName = file.name.replace(/\.[^/.]+$/, '');

  setUploadedAudioUri(file.uri);
  setMeetingName(cleanName); // 👈 auto-filled & editable
  setShowSaveModal(true);
};

/**
 * Handling confirming upload
 */
const confirmSaveUpload = async () => {
  if (!uploadedAudioUri) return;

  try {
    const groupId = await insertOrGetGroup(groupName);

    await insertMeeting({
      title: meetingName,
      audioUri: uploadedAudioUri,
      duration: 0,              // unknown for uploads (OK)
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      groupId,
    });

    console.log('✅ Uploaded audio saved');
  } catch (e) {
    console.error('❌ Upload save failed', e);
  } finally {
    resetUploadState();
  }
};


/**
 * Handling Cancel Upload 
 */

const cancelSaveUpload = () => {
  resetUploadState();
};


/**
 * Reseting Upload state
 */
const resetUploadState = () => {
  setUploadedAudioUri(null);
  setMeetingName('');
  setGroupName('');
  setShowSaveModal(false);
};



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
        onPress={handleUploadAudio}
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

      <SaveMeetingModal
        visible={showSaveModal}
        meetingName={meetingName}
        setMeetingName={setMeetingName}
        groupName={groupName}
        setGroupName={setGroupName}
        groups={groups}
        setGroups={setGroups}
        onCancel={cancelSaveUpload}
        onSave={confirmSaveUpload}
      />

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
