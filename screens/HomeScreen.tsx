import React from 'react';
import { View } from 'react-native';
import { Container } from '../components/Container';
import { ScreenContent } from '../components/ScreenContent';

export function HomeScreen() {
  return (
    <Container headerTitle="{Organization Name}">
      <ScreenContent 
        title="Dashboard" 
        path="screens/HomeScreen.tsx"
      />
    </Container>
  );
}