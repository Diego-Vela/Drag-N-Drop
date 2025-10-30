import React from 'react';
import { View } from 'react-native';
import { Container, ScreenContent } from '../components';
import { useData } from '../contexts';

export function CustomersScreen() {
  const { getGroupedAssignments } = useData();
  const assignments = getGroupedAssignments();
  console.log(assignments);
  return (
    <Container headerTitle="Customer/Locations">
      <ScreenContent 
        title="Customers" 
        path="screens/CustomersScreen.tsx"
      />
    </Container>
  );
}