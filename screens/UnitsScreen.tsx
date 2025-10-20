import React from 'react';
import { View } from 'react-native';
import { Container } from '../components/Container';
import { ScreenContent } from '../components/ScreenContent';

export function UnitsScreen() {
  return (
    <Container headerTitle="Units">
      <ScreenContent 
        title="Units" 
        path="screens/UnitsScreen.tsx"
      />
    </Container>
  );
}