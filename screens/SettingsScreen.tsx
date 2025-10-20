import React from 'react';
import { View } from 'react-native';
import { Container } from '../components/Container';
import { ScreenContent } from '../components/ScreenContent';

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