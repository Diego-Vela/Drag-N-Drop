// Base Imports
import React from 'react';
import { View } from 'react-native';
// Component Imports
import { Container } from '../components/Container';
import { ScreenContent } from '../components/ScreenContent';

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