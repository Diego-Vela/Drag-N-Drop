import React from 'react';
import { View } from 'react-native';
import { Container, ScreenContent } from '../components/base';

export function HomeScreen() {
  return (
    <Container headerTitle="Group Name">
      <ScreenContent 
        title="Dashboard" 
        path="screens/HomeScreen.tsx"
      />
    </Container>
  );
}