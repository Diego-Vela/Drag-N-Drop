import React from 'react';
import { View } from 'react-native';
import { Container, ScreenContent } from '../components/base';

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