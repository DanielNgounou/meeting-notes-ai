import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useState } from 'react';


export default function HomeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
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
      if (!recording) return;

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
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        {isRecording ? 'Recording…' : 'Meeting Notes App'}
      </Text>

      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={{
          backgroundColor: isRecording ? 'red' : 'black',
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white' }}>
          {isRecording ? 'STOP' : 'START RECORDING'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}