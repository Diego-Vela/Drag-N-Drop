import React from 'react';
import { View } from 'react-native';
import { Container } from '../components/Container';
import { ScreenContent } from '../components/ScreenContent';

export function CustomersScreen() {
  return (
    <Container headerTitle="Customer/Locations">
      <ScreenContent 
        title="Customers" 
        path="screens/CustomersScreen.tsx"
      />
    </Container>
  );
}