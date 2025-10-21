// Base Imports
import React from 'react';
import { View } from 'react-native';
// Component Imports
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