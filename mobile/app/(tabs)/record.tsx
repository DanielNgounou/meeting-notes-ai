//Importing Lottie 
import LottieView from 'lottie-react-native';


// React Native basic UI components
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';


// Expo Audio API (used for microphone recording)
import { Audio } from 'expo-av';

// React hooks
// import { useState, useEffect } from 'react';

// Icons (mic, pause, stop)
import { Ionicons } from '@expo/vector-icons';


//React hooks
import { useState, useEffect, useRef } from 'react';

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

  // Indicates whether recording is paused
  const [isPaused, setIsPaused] = useState(false);

  // Animated values for waveform bars
    const wave1 = useRef(new Animated.Value(0.3)).current;
    const wave2 = useRef(new Animated.Value(0.6)).current;
    const wave3 = useRef(new Animated.Value(0.4)).current;
    const wave4 = useRef(new Animated.Value(0.7)).current;
    const waveAnimation = useRef<Animated.CompositeAnimation | null>(null);

    // Variable for Lottie
    const waveRef = useRef<LottieView>(null);




  /* =======================
     TIMER LOGIC
     ======================= */

  // This effect runs when isRecording changes
  useEffect(() => {
    let interval: any;

    // Timer runs ONLY when recording AND not paused
    if (isRecording && !isPaused) {
        interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        }, 1000);
    }

    return () => clearInterval(interval);
    }, [isRecording, isPaused]);


  // Convert seconds to mm:ss format
  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const secs = s % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };




/* =======================
   LOTTIE EFFECT
   ======================= */
    useEffect(() => {
        if (isRecording && !isPaused) {
            waveRef.current?.play();
        } else {
            waveRef.current?.pause();
        }
    }, [isRecording, isPaused]);




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
      setIsPaused(false);
      setSeconds(0);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  /* =======================
     PAUSE RECORDING
     ======================= */

    const pauseRecording = async () => {
        if (!recording) return;

        try {
            await recording.pauseAsync(); // pause audio
            setIsPaused(true);            // pause UI + timer
        } catch (error) {
            console.error('Failed to pause recording', error);
        }
    };

    /* =======================
     RESUME RECORDING
     ======================= */

    const resumeRecording = async () => {
        if (!recording) return;

        try {
            await recording.startAsync(); // resume audio
            setIsPaused(false);           // resume UI + timer
        } catch (error) {
            console.error('Failed to resume recording', error);
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
    <View
    style={{
        marginTop: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }}
    >
    {/* Left side: Text */}
    <View>
        <Text
        style={{
            fontSize: 22,
            fontWeight: '600',
            letterSpacing: 0.3,
            color: '#111',
        }}
        >
        Hello, Vanessa
        </Text>

        <Text
        style={{
            fontSize: 14,
            color: '#9E9E9E',
            marginTop: 4,
        }}
        >
        Welcome to MeetingNotes
        </Text>
    </View>

    {/* Right side: Profile avatar placeholder */}
    <View
        style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E0E0E0',
        }}
    />
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
                {isPaused ? 'Paused' : 'Recording...'}
            </Text>

            {/* Lottie Sound Wave */}
            <LottieView
                ref={waveRef}
                source={require('../../assets/animations/waveform.json')}
                autoPlay={false}
                loop={true}
                style={{
                    width: 900,
                    height: 100,
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
                    onPress={isPaused ? resumeRecording : pauseRecording}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: '#D9D9D9',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                    <Ionicons
                        name={isPaused ? 'play' : 'pause'}
                        size={20}
                        color="#000"
                    />
                </TouchableOpacity>

            </View>
            </>
        )}
        </View>
    </View>
    );
}
