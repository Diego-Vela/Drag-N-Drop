import React from 'react';
import { View } from 'react-native';
import { Container, ScreenContent } from '../components/base';

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