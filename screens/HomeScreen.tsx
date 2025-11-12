import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Container, ScreenContent } from '../components/base';
import { AssignmentContainer } from '../components/home-screen';
import { useTheme, useNewData, AssignmentObject, Unit } from '../contexts';

const GroupName = 'Sugma';

export function HomeScreen() {
  const { isDark } = useTheme();
  const { assignments, units, customers, locations, getAssignmentObjects, getUnassignedUnits } = useNewData();

  const [groupedAssignments, setGroupedAssignments] = useState<AssignmentObject[]>([]);
  const [unassigned, setUnassigned] = useState<Unit[]>([]);

  // --- Load data when component mounts ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const assignments = await getAssignmentObjects();
        const unassignedUnits = getUnassignedUnits();
        setGroupedAssignments(assignments);
        setUnassigned(unassignedUnits);
      } catch (err) {
        console.error('Error loading assignments:', err);
      }
    };
    loadData();
  }, [customers, locations, units, assignments]);

  // --- Prepare flat list data ---
  const flatListData = [
    // Assigned zones
    ...groupedAssignments.map(({ customer, location, units }) => ({
      key: `${customer}__${location}`,
      customer,
      location,
      units,
      isUnassigned: false,
    })),
    // Unassigned zone at the bottom
    {
      key: 'unassigned',
      customer: 'Unassigned',
      location: 'Available Units',
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
              title={item.customer}
              subtitle={item.location}
              units={item.units}
              isDark={isDark}
              isUnassigned={item.isUnassigned}
            />
          )}
          style={{ flex: 1, backgroundColor: 'transparent' }}
          contentContainerStyle={{
            paddingBottom: 60,
            overflow: 'visible',
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ScreenContent>
    </Container>
  );
}
