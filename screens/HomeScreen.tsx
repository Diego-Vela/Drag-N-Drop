import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Container, ScreenContent, SearchBar, ActionBar } from '../components';
import { AssignmentContainer } from '../components/home-screen';
import { useTheme, useNewData, AssignmentObject, Unit } from '../contexts';
import { useSearchFilter } from '../hooks';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { playSound } from 'utils';

import { RootStackParamList } from '../App';

const GroupName = 'Dashboard';

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
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
  const listData = [
    // Assigned zones
    ...groupedAssignments.map(({ customer, location, units }) => ({
      key: [
        customer?.name,
        location?.name,
        ...(units?.map(u => u.name) || [])
      ].filter(Boolean).join(' '),
      customer,
      location,
      units,
      isUnassigned: false,
    })),
    // Unassigned zone at the bottom
    {
      key: [
        'Unassigned',
        'Available Units',
        ...(unassigned?.map(u => u.name) || [])
      ].filter(Boolean).join(' '),
      customer: { id: 'Unassigned', name: 'Unassigned'},
      location: { id: 'unassigned', customer_id: 'Unassigned', name: 'Available Units' },
      units: unassigned,
      isUnassigned: true,
    },
  ];

  const {
    query: listQuery,
    setQuery: setListQuery,
    filtered: filteredListData
  } = useSearchFilter(listData, { keys: ['key']});

  const handleEditButton = () => {
    navigation.navigate('Edit');
  }

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/HomeScreen.tsx">

        {/* Search Bar */}
        <View className='h-16 min-h-[5%] max-h-[7%] justify-center items-center mt-4 mx-4'>
          <SearchBar isDark={isDark} placeholder='Search for customer/locations/units...' query={listQuery} onSearchChange={setListQuery}/>
        </View>

        {/* Action Bar Reservation */}
        <View className={`h-16 mx-4 mt-2 rounded-xl overflow-hidden`}>
          <ActionBar isDark={isDark} buttons={['Edit Mode']} actions={[handleEditButton]}/>
        </View>

        {/* Data Section */}
        <FlatList
          data={filteredListData}
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
          }}
          showsVerticalScrollIndicator={false}
        />
      </ScreenContent>
    </Container>
  );
}
