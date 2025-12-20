//Importing components
import SaveMeetingModal from '../../components/SaveMeetingModal';

//Import Alert 
import { Alert } from 'react-native';


//Importing Lottie 
import LottieView from 'lottie-react-native';


// React Native basic UI components
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { LayoutAnimation, Platform, UIManager } from 'react-native';



// Expo Audio API (used for microphone recording)
import { Audio } from 'expo-av';

// React hooks
// import { useState, useEffect } from 'react';

// Icons (mic, pause, stop)
import { Ionicons } from '@expo/vector-icons';


//React hooks
import { useState, useEffect, useRef } from 'react';

export default function RecordScreen() {

    if (
        Platform.OS === 'android' &&
        UIManager.setLayoutAnimationEnabledExperimental
        ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

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
    const waveAnimation = useRef<Animated.CompositeAnimation | null>(null);

    // Variable for Lottie
    const waveRef = useRef<LottieView>(null);

    // Animation values
    const idleOpacity = useRef(new Animated.Value(1)).current;
    const recordOpacity = useRef(new Animated.Value(0)).current;

    // Component variable

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [meetingName, setMeetingName] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groups, setGroups] = useState(['SEG 2025', 'Life group']);

    // Stop Guard for stop recording
    const [isStopping, setIsStopping] = useState(false);



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
    LAYOUT ANIMATION EFFECTS
   ======================= */
   useEffect(() => {
        if (isRecording) {
            Animated.parallel([
            Animated.timing(idleOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(recordOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            ]).start();
        } else {
            Animated.parallel([
            Animated.timing(idleOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(recordOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            ]).start();
        }
    }, [isRecording]);




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

  const requestStopRecording = async () => {

    if (isStopping || !recording || showSaveModal) return ;

    setIsStopping(true);
    try {


      // pauses recording and opens save modal
      await recording.pauseAsync();
      setIsPaused(true)
      setShowSaveModal(true);//Opens Modal


      // Get local file URI
      const uri = recording.getURI();

      // Log URI (later used for saving or uploading)
      console.log('Recording saved at:', uri);

    }catch (error) {
      console.error('Failed to stop recording', error);
    }finally{
        setIsStopping(false)
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
     EXIT RECORDING
     ======================= */

    const exitRecording = () => {
    Alert.alert(
        'Discard recording?',
        'Your current recording will be lost.',
        [
        {
            text: 'Cancel',
            style: 'cancel',
        },
        {
            text: 'Discard',
            style: 'destructive',
            onPress: async () => {
            try {
                if (recording) {
                await recording.stopAndUnloadAsync();
                }

                setRecording(null);
                setIsRecording(false);
                setIsPaused(false);
                setSeconds(0);
            } catch (error) {
                console.error('Failed to exit recording', error);
            }
            },
        },
        ]
    );
    };
    /*==========SAVE BUTTON ============*/
    const confirmSaveRecording = async () => {
    if (!recording) return;

    try {
        await recording.stopAndUnloadAsync(); // ✅ final stop

        const uri = recording.getURI();
        console.log('Saved recording at:', uri);

        // TODO: persist metadata (meetingName, groupName)

    } catch (error) {
        console.error('Failed to save recording', error);
    } finally {
        // Reset everything
        setRecording(null);
        setIsRecording(false);
        setIsPaused(false);
        setSeconds(0);
        
        setShowSaveModal(false);
        resetSaveMeetingData();
    }
    };


    //==============CANCEL BUTTON resumes recording ===================//
    const cancelSaveRecording = async () => {
        if (recording){
            try{
                await recording.startAsync();//Resume recording
                setIsPaused(false);
            }catch (error){
                console.error('Failed to resume recording', error);
            }
        }
     
        setShowSaveModal(false);
        resetSaveMeetingData();
    };



    //Save Meeting Modal Reset variables
    const resetSaveMeetingData = () => {
        setMeetingName('');
        setGroupName('');
    };

    const handleCancelSaveMeeting = () => {
        setShowSaveModal(false);
        resetSaveMeetingData();
    };


    const handleSaveMeeting = () => {
        // TODO: persist recording + metadata

        setShowSaveModal(false);
        resetSaveMeetingData();
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
            {/* ===== IDLE (Tap to record) ===== */}
            <Animated.View
            pointerEvents={isRecording ? 'none' : 'auto'}
            style={{
                opacity: idleOpacity,
                position: 'absolute',
                alignItems: 'center',
            }}
            >
            <TouchableOpacity
                onPress={startRecording}
                style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
                
                }}
            >
                <Ionicons name="mic" size={36} color="#fff" />
            </TouchableOpacity>

            <Text
                style={{
                marginTop: 18,
                fontSize: 14,
                color: '#7A7A7A',
                }}
            >
                Tap to record your meeting
            </Text>
            </Animated.View>


        
       {/* ===== RECORDING ===== */}
        <Animated.View
            pointerEvents={isRecording ? 'auto' : 'none'}
            style={{
                opacity: recordOpacity,
                alignItems: 'center',
            }}
        >
        {/* Recording State */}
        <Ionicons name="mic" size={54} color="red" />
        <Text
            style={{
            marginTop: 10,
            fontSize: 18,
            fontWeight: '800',
            }}
        >
            {isPaused ? 'Paused' : 'Recording...'}
        </Text>

        {/* Lottie Sound Wave */}
        <LottieView
            ref={waveRef}
            source={require('../../assets/animations/waveform.json')}
            autoPlay={false}
            loop
            style={{
            width: 900,
            height: 100,
            marginVertical: 18,
            }}
        />

        <Text style={{ fontSize: 18, fontWeight: '600' }}>
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
            onPress={requestStopRecording}
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

             <TouchableOpacity
                onPress={exitRecording}
                style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#f17e7eff',
                justifyContent: 'center',
                alignItems: 'center',
                }}
            >
                <Ionicons name="close" size={22} color="#ffffffff" />
            </TouchableOpacity>
        </View>
        </Animated.View>

        </View>
        {/*==========Save Meeting Modal ===========*/}
        <SaveMeetingModal
            visible={showSaveModal}
            meetingName={meetingName}
            setMeetingName={setMeetingName}
            groupName={groupName}
            setGroupName={setGroupName}
            groups={groups}
            setGroups={setGroups}
            onCancel={cancelSaveRecording}
            onSave={confirmSaveRecording}
        />

    </View>

    );


}
