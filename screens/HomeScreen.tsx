import React from 'react';
import { FlatList } from 'react-native';
import { Container, ScreenContent } from '../components/base';
import { AssignmentContainer } from '../components/home-screen';
import { useTheme, useData } from '../contexts';

const GroupName = 'Sugma'

export function HomeScreen() {
  const { getUnassignedUnits, getGroupedAssignments } = useData();
  const groupedAssignments = getGroupedAssignments();
  const unassigned = getUnassignedUnits();
  const { isDark } = useTheme();

  // Prepare data for FlatList: all grouped assignments + unassigned as last item
  const flatListData = [
    ...groupedAssignments.map(({ customerName, locationName, units }) => ({
      key: `${customerName}__${locationName}`,
      customerName,
      locationName,
      units,
      isUnassigned: false,
    })),
    {
      key: 'unassigned',
      customerName: 'Unassigned',
      locationName: 'Available Units',
      units: unassigned,
      isUnassigned: true,
    },
  ];

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/HomeScreen.tsx">
        <FlatList
          data={flatListData}
          renderItem={({ item }) => (
            <AssignmentContainer
              key={item.key}
              title={item.customerName}
              subtitle={item.locationName}
              units={item.units}
              isDark={isDark}
              isUnassigned={item.isUnassigned}
            />
          )}
          style={{ flex: 1, backgroundColor: 'transparent' }}
          contentContainerStyle={{
            paddingBottom: 60,
            overflow: 'visible',
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 16,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ScreenContent>
    </Container>
  );
}