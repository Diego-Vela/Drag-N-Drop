import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { Container, ScreenContent } from '../components';
import { useTheme } from '../contexts';
import { getSound } from '../utils';

export function SettingsScreen() {
  const { isDark } = useTheme();
  const soundKeys = ['dragStart', 'unitMove', 'duck', 'wow', 'baka'] as const;
  const players: Record<typeof soundKeys[number], ReturnType<typeof useAudioPlayer>> = {
    dragStart: useAudioPlayer(getSound('dragStart')),
    unitMove: useAudioPlayer(getSound('unitMove')),
    duck: useAudioPlayer(getSound('duck')),
    wow: useAudioPlayer(getSound('wow')),
    baka: useAudioPlayer(getSound('baka')),
  };

  const playSound = (id: typeof soundKeys[number]) => {
    players[id].seekTo(0);
    players[id].play();
  }

  return (
    <Container headerTitle="Settings">
      <ScreenContent title="Settings" path="screens/SettingsScreen.tsx">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {soundKeys.map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => playSound(key)}
              style={{ margin: 10, padding: 16, backgroundColor: '#4B5563', borderRadius: 8 }}
            >
              <Text style={{ color: 'white', fontSize: 18 }}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScreenContent>
    </Container>
  );
}