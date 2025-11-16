import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Container, ScreenContent } from '../components';
import { useNewData, useTheme } from '../contexts';
import { playSound } from 'utils';

export function SettingsScreen() {
  const { isDark } = useTheme();
  
  return (
    <Container headerTitle="Settings">
      <ScreenContent title="Settings" path="screens/SettingsScreen.tsx">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => playSound('duck')} style={{ margin: 10, padding: 16, backgroundColor: '#4B5563', borderRadius: 8 }}>
            <Text style={{ color: 'white', fontSize: 18 }}>duck</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playSound('baka')} style={{ margin: 10, padding: 16, backgroundColor: '#4B5563', borderRadius: 8 }}>
            <Text style={{ color: 'white', fontSize: 18 }}>baka</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playSound('wow')} style={{ margin: 10, padding: 16, backgroundColor: '#4B5563', borderRadius: 8 }}>
            <Text style={{ color: 'white', fontSize: 18 }}>wow</Text>
          </TouchableOpacity>
        </View>
      </ScreenContent>
    </Container>
  );
}