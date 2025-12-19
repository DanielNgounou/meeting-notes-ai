import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function RecordScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const startRecording = async () => {
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
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Saved at:', uri);

    setRecording(null);
    setIsRecording(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      {/* Header */}
      <View style={{ marginTop: 60, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>
          Hello, Vanessa
        </Text>
        <Text style={{ color: '#999', marginTop: 4 }}>
          Welcome to MeetingNotes
        </Text>
      </View>

      {/* Main content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isRecording ? (
          <>
            <Ionicons name="mic" size={60} color="red" />
            <Text style={{ marginTop: 12, fontSize: 16 }}>
              Recording…
            </Text>

            {/* Fake waveform (placeholder) */}
            <View
              style={{
                width: 180,
                height: 30,
                backgroundColor: '#eee',
                borderRadius: 20,
                marginVertical: 20,
              }}
            />

            <Text style={{ fontSize: 18, marginBottom: 30 }}>
              {formatTime(seconds)}
            </Text>

            {/* Controls */}
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <TouchableOpacity
                onPress={stopRecording}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#000',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="square" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#ccc',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="pause" size={22} color="#000" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={startRecording}
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="mic" size={36} color="#fff" />
            </TouchableOpacity>

            <Text style={{ marginTop: 20, color: '#666' }}>
              Tap to record your meeting
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
