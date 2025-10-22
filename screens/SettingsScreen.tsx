import React from 'react';
import { View } from 'react-native';
import { Container, ScreenContent } from '../components/base';

export function SettingsScreen() {
  return (
    <Container headerTitle="Settings">
      <ScreenContent 
        title="Settings" 
        path="screens/SettingsScreen.tsx"
      />
    </Container>
  );
}