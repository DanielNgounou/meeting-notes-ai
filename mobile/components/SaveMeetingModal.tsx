import React from 'react';
import { Animated, Easing } from 'react-native';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  meetingName: string;
  setMeetingName: (v: string) => void;

  groupName: string;
  setGroupName: (v: string) => void;

  groups: string[];
  setGroups: (v: string[]) => void;

  onCancel: () => void;
  onSave: () => void;
};

export default function SaveMeetingModal({
  visible,
  meetingName,
  setMeetingName,
  groupName,
  setGroupName,
  groups,
  setGroups,
  onCancel,
  onSave,
}: Props) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isNewGroup, setIsNewGroup] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const modalTranslateY = React.useRef(new Animated.Value(40)).current;

  // Keep it rendered long enough to animate OUT
  const [shouldRender, setShouldRender] = React.useState(visible);


  const resetModalState = () => {
    setShowDropdown(false);
    setIsNewGroup(false);
    setSearch('');
  };


 
  /*========================
        RESET EFFECT
  ========================*/
  React.useEffect(() => {
    if (!visible) {
        resetModalState();
    }
  }, [visible]);



/*========================
        ANIMATION IN AND OUT
  ========================*/
React.useEffect(() => {
  if (visible) {

    // ensure modal is mounted
    setShouldRender(true);

    //reset every time you open
    backdropOpacity.setValue(0);
    modalTranslateY.setValue(40);


    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(modalTranslateY, {
        toValue: 0,
        damping: 18,
        stiffness: 150,
        useNativeDriver: true,
      }),
    ]).start();
  } else {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslateY, {
        toValue: 40,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
        if (finished) setShouldRender(false); //Unmount after animation
    });
  }
 }, [visible]);//dependency array to prevent it to run on every rended



// Visibiity Guard
  if (!shouldRender) return null;


  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: backdropOpacity,
      }}
    >
      <Animated.View
        style={{
          width: '85%',
          backgroundColor: '#FFF',
          borderRadius: 18,
          padding: 20,
          transform: [{translateY: modalTranslateY }], // animation
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 14 }}>
          Save meeting
        </Text>

        {/* Meeting name */}
        <TextInput
          placeholder="Recording name"
          value={meetingName}
          onChangeText={setMeetingName}
          style={{
            backgroundColor: '#F2F2F2',
            borderRadius: 10,
            padding: 14,
            marginBottom: 12,
          }}
        />

        {/* Group selector */}
        {!isNewGroup ? (
          <>
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              style={{
                backgroundColor: '#F2F2F2',
                borderRadius: 10,
                padding: 14,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text>{groupName || 'Recording group name'}</Text>
              <Ionicons name="chevron-down" size={18} />
            </TouchableOpacity>

            {showDropdown && (
              <View
                style={{
                  marginTop: 8,
                  backgroundColor: '#F9F9F9',
                  borderRadius: 10,
                  maxHeight: 160,
                  padding: 8,
                }}
              >
                <TextInput
                  placeholder="Search group"
                  value={search}
                  onChangeText={setSearch}
                  style={{
                    backgroundColor: '#EEE',
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 6,
                  }}
                />

                <ScrollView>
                  {groups
                    .filter(g =>
                      g.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((g, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setGroupName(g);
                          setShowDropdown(false);
                        }}
                        style={{ paddingVertical: 10 }}
                      >
                        <Text>{g}</Text>
                      </TouchableOpacity>
                    ))}

                  <TouchableOpacity
                    onPress={() => {
                      setIsNewGroup(true);
                      setShowDropdown(false);
                    }}
                    style={{ paddingVertical: 10, alignItems: 'center' }}
                  >
                    <Text style={{ fontWeight: '600' }}>＋ New</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </>
        ) : (
          <TextInput
            placeholder="New group name"
            value={groupName}
            onChangeText={setGroupName}
            style={{
              backgroundColor: '#F2F2F2',
              borderRadius: 10,
              padding: 14,
              marginTop: 8,
            }}
          />
        )}

        {/* Actions */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
          }}
        >
          <TouchableOpacity
            onPress={()=>{
                resetModalState();
                onCancel();}}
            style={{
              backgroundColor: '#DDD',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=>{
                resetModalState();
                onSave();
            }}
            style={{
              backgroundColor: '#000',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#FFF' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
