import React from 'react';
import { ScrollView } from 'react-native';
import { Container, ScreenContent } from '../components/base';
import { AssignmentContainer } from '../components/home-screen';
import { useTheme, useData } from '../contexts';

export function HomeScreen() {
  const { getUnassignedUnits, getGroupedAssignments } = useData();
  const groupedAssignments = getGroupedAssignments();
  const unassigned = getUnassignedUnits();
  const { isDark } = useTheme();

  return (
    <Container headerTitle="Group Name">
      <ScreenContent title="Dashboard" path="screens/HomeScreen.tsx">
        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent' }}
          className="px-4 pt-4"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: 60,
            overflow: 'visible',
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Assigned units grouped by customer/location */}
          {groupedAssignments.map(({ customerName, locationName, units }) => (
            <AssignmentContainer
              key={`${customerName}__${locationName}`}
              title={customerName}
              subtitle={locationName}
              units={units}
              isDark={isDark}
            />
          ))}

          {/* Unassigned units */}
          <AssignmentContainer
            title="Unassigned"
            subtitle="Available Units"
            units={unassigned}
            isDark={isDark}
            isUnassigned={true}
          />

        </ScrollView>
      </ScreenContent>
    </Container>
  );
}