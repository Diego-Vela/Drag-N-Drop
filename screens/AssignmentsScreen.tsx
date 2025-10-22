import React from 'react';
import { View } from 'react-native';
import { Container, ScreenContent } from '../components/base';

export function AssignmentsScreen() {
  return (
    <Container headerTitle="Assignments">
      <ScreenContent 
        title="Assignments" 
        path="screens/AssignmentsScreen.tsx"
      />
    </Container>
  );
}