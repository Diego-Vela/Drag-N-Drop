import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Container, ScreenContent, SearchBar, ActionBar, ItemList } from '../components';
import type { ListGroup, ListElement } from '../components';
import { useNewData, useTheme } from '../contexts';

export function UnitsScreen() {
  const { isDark } = useTheme();
  const { units, locations, addUnit, refetch } = useNewData();

  const [unitName, setUnitName] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  //setRefreshKey((prev) => prev + 1);

  const handleAddButton = () => {
    setCanEdit(!canEdit);
  }

  const handleAdd = async () => {
    if (!unitName.trim()) {
      Alert.alert('Missing Info', 'Please fill the field');
      return;
    }

    const success = await addUnit(unitName);

    if (success) {
      console.log('Success', `Added ${unitName} to Units`);
      setUnitName('');
    } else {
      console.log('Error', 'Failed to add entry. Check logs for details.');
    }

    refetch();
    setRefreshKey((prev) => prev + 1);
    setCanEdit(false);
  }

  // Helper function to list ready data - Memoized to not recalc on every render.
  const listData: ListGroup[] = useMemo(() => {
    if (!units || units.length === 0) {
      return [{ key: 'empty', label: 'Units', elements: [] }];
    }

    const elements: ListElement[] = units.map((u: any) => ({
      label: u.name ?? u.unit ?? '',
      sublabel: ''
    }));

    return [{ key:'temp', label: 'Units', elements }];
  }, [units]);

  return (
    <Container headerTitle="Units">
      <ScreenContent title="Units" path="screens/UnitsScreen.tsx"/>

        {/* Search Bar Component */}
        <View className='h-16 min-h-[5%] max-h-[7%] justify-center items-center mt-4 mx-4'>
          <SearchBar isDark={isDark} onSearchChange={()=>{}}/>
        </View>

        {/* Action Bar Reservation */}
        <View className={`h-16 mx-4 my-2 rounded-xl overflow-hidden`}>
          <ActionBar isDark={isDark} buttons={['Add']} actions={[handleAddButton]}/>
        </View>

        {/* List Component: will take in an array of section titles and an equal length, 2D array of elements that correspond to each section */}
        <View className='flex-1'>
          <ItemList isDark={isDark} elements={listData} />
        </View>
        
        {/* Temp Section to Add New Customer Locations */}
        {canEdit ? ( 
        <View className={`h-48 mx-4 p-4`}>
          <TextInput
            placeholder="Unit Name"
            value={unitName}
            onChangeText={setUnitName}
            className="bg-white p-3 rounded-md w-full mb-3"
          />

          <TouchableOpacity
            onPress={handleAdd}
            className="bg-blue-500 px-6 py-3 rounded-lg"
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg font-semibold">Add Unit</Text>
          </TouchableOpacity>
        </View>
        ) : ( <></> )}

    </Container>
  );
}