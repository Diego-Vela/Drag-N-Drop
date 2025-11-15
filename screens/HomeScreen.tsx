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
      key: `${customer.name}__${location.name}`,
      customer,
      location,
      units,
      isUnassigned: false,
    })),
    // Unassigned zone at the bottom
    {
      key: 'unassigned',
      customer: { id: 'Unassigned', name: 'Unassigned'},
      location: { id: 'unassigned', customer_id: 'Unassigned', name: 'Available Units' },
      units: unassigned,
      isUnassigned: true,
    },
  ];

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/HomeScreen.tsx">

        {/* Search Bar */}

        {/* Action Bar */}

        {/* Data Section */}
        <FlatList
          data={flatListData}
          renderItem={({ item }) => (
            <AssignmentContainer
              key={item.key}
              title={item.location}
              subtitle={item.customer}
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
