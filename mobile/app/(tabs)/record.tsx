// React Native basic UI components
import { View, Text, TouchableOpacity } from 'react-native';

// Expo Audio API (used for microphone recording)
import { Audio } from 'expo-av';

// React hooks
import { useState, useEffect } from 'react';

// Icons (mic, pause, stop)
import { Ionicons } from '@expo/vector-icons';

export default function RecordScreen() {
  /* =======================
     STATE VARIABLES
     ======================= */

  // Stores the active recording object from Expo
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // Indicates whether recording is currently active
  const [isRecording, setIsRecording] = useState(false);

  // Stores elapsed recording time (in seconds)
  const [seconds, setSeconds] = useState(0);

  /* =======================
     TIMER LOGIC
     ======================= */

  // This effect runs when isRecording changes
  useEffect(() => {
    let interval: any;

    if (isRecording) {
      // If recording started, increase timer every second
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      // If recording stopped, reset timer
      clearInterval(interval);
      setSeconds(0);
    }

    // Cleanup interval when component unmounts or state changes
    return () => clearInterval(interval);
  }, [isRecording]);

  // Convert seconds to mm:ss format
  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const secs = s % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  /* =======================
     START RECORDING
     ======================= */

  const startRecording = async () => {
    try {
      // Ask user for microphone permission
      await Audio.requestPermissionsAsync();

      // Configure phone audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create a new audio recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      // Save recording object in state
      setRecording(recording);

      // Switch UI to recording mode
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  /* =======================
     STOP RECORDING
     ======================= */

  const stopRecording = async () => {
    try {
      if (!recording) return;

      // Stop recording and save file
      await recording.stopAndUnloadAsync();

      // Get local file URI
      const uri = recording.getURI();

      // Log URI (later used for saving or uploading)
      console.log('Recording saved at:', uri);

      // Clear recording state
      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  /* =======================
     UI RENDER
     ======================= */

 return (
  <View
    style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
    }}
  >
    {/* ===== Header ===== */}
    <View style={{ marginTop: 48 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '800',
          textAlign: 'left',
        }}
      >
        Hello, Vanessa
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: '#9E9E9E',
          textAlign: 'left',
          marginTop: 6,
        }}
      >
        Welcome to MeetingNotes
      </Text>
    </View>

    {/* ===== Main Content ===== */}
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!isRecording ? (
        <>
          {/* Mic Button */}
          <TouchableOpacity
            onPress={startRecording}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: '#000',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 6, // Android shadow
            }}
          >
            <Ionicons name="mic" size={36} color="#fff" />
          </TouchableOpacity>

          {/* Instruction */}
          <Text
            style={{
              marginTop: 18,
              fontSize: 14,
              color: '#7A7A7A',
            }}
          >
            Tap to record your meeting
          </Text>
        </>
      ) : (
        <>
          {/* Recording State */}
          <Ionicons name="mic" size={54} color="red" />
          <Text style={{ 
            marginTop: 10, 
            fontSize: 18,
            fontWeight:"800" }}>
            Recording…
          </Text>

          <View
            style={{
              width: 160,
              height: 28,
              backgroundColor: '#ECECEC',
              borderRadius: 16,
              marginVertical: 18,
            }}
          />

          <Text style={{ fontSize: 18, fontWeight: "600"}}>
            {formatTime(seconds)}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 28,
              gap: 28,
            }}
          >
            <TouchableOpacity
              onPress={stopRecording}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="square" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#D9D9D9',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="pause" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  </View>
);
}
