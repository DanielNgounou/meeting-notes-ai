import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useState } from 'react';

export default function RecordScreen() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording saved at:', uri);

      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>
        {isRecording ? 'Recording...' : 'Tap to record your meeting'}
      </Text>

      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={{
          backgroundColor: isRecording ? 'red' : 'black',
          padding: 30,
          borderRadius: 50,
        }}
      >
        <Text style={{ color: 'white' }}>
          {isRecording ? 'STOP' : 'RECORD'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
