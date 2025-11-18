import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Container, ScreenContent, SearchBar, ItemList, ActionBar } from '../components';
import { useNewData, useTheme, useSound } from '../contexts';
import { useSearchFilter } from '../hooks';
import { getSound } from '../utils';

import type { ListGroup, ListElement } from '../components';

export function CustomersScreen() {
  const { isDark } = useTheme();
  const { customers, locations, addCustomerLocationPair, dropAllTables, refetch } = useNewData();

  const [customerName, setCustomerName] = useState('');
  const [locationName, setLocationName] = useState('');

  const [canEdit, setCanEdit] = useState(false);

  const { playSound } = useSound(); 
  
  //#region Functions

  const handleResetButton = async () => {
    await dropAllTables();
    Alert.alert('Pressed!', '💣 YOU JUST BOOMED THE DATABASE!!!.');
    await refetch();
  }

  const handleAddButton = () => {
    setCanEdit(!canEdit);
  }

  const handleAdd = async () => {
    if (!customerName.trim() || !locationName.trim()) {
      Alert.alert('Missing Info', 'Please fill in both fields.');
      return;
    }

    const success = await addCustomerLocationPair(customerName, locationName);

    if (success) {
      console.log('Success', `Added ${locationName} under ${customerName}`);
      setCustomerName('');
      setLocationName('');
      refetch();
      playSound('unitMove');
    } else {
      console.log('Error', 'Failed to add entry. Check logs for details.');
    }

    refetch();
    setCanEdit(false);
  };




  // Helper function to map to list ready data - Memoized to not recalc on every render
  const listData: ListGroup[] = useMemo(() => {
    if (!customers || !locations) return [];
    return customers.map((customer) => {
      const customerLocations = locations.filter(
        (loc) => loc.customer_id === customer.id
      );

      const elements: ListElement[] = customerLocations.map((loc) => ({
        label: loc.name,        
        sublabel: customer.name 
      }));

      // Key is customer name + all location names
      const key = [
        customer.name,
        ...customerLocations.map(loc => loc.name)
      ].filter(Boolean).join(' ');

      return {
        key,
        label: customer.name,
        elements,
      };
    });
  }, [customers, locations]);

  //#region Search Hooks FIXXX
  const { 
    query: clQuery,
    setQuery: setClQuery,
    filtered: filteredListData,
  } = useSearchFilter(listData, { keys: ['key']})

  //#region Render
  return (
    <Container headerTitle="Customer/Locations">
      <ScreenContent title="Customers" path="screens/CustomersScreen.tsx">
      
        {/* Search Bar Component */}
        <View className='h-16 min-h-[5%] max-h-[7%] justify-center items-center mt-4 mx-4'>
          <SearchBar placeholder="Search for customer/locations..." query={clQuery} onSearchChange={setClQuery} isDark={isDark}/>
        </View>

        {/* Action Bar Reservation */}
        <View className={`h-16 mx-4 my-2 rounded-xl overflow-hidden`}>
          <ActionBar isDark={isDark} buttons={[canEdit ? 'Cancel Add' : 'Add', 'Reset DB']} actions={[handleAddButton, handleResetButton]}/>
        </View>

        {/* Temp Section to Add New Customer Locations */}
        {canEdit ? ( 
        <View className={`mb-4 mx-4`}>
          <TextInput
            placeholder="Customer Name"
            value={customerName}
            onChangeText={setCustomerName}
            placeholderTextColor={isDark ? '#6B7280' : ''}
            className={` p-3 rounded-md w-full mb-3 ${ isDark ? 'bg-dark-surface/80' : 'bg-white' }`}
          />
          <TextInput
            placeholder="Location Name"
            value={locationName}
            onChangeText={setLocationName}
            placeholderTextColor={isDark ? '#6B7280' : ''}
            className={`bg-white p-3 rounded-md w-full mb-3 ${ isDark ? 'bg-dark-surface/80' : 'bg-white' }`}
          />
          <TouchableOpacity
            onPress={handleAdd}
            className={`px-6 py-3 rounded-lg ${ isDark ? 'bg-green-500/60': 'bg-green-500' }`}
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg font-semibold">Add Customer - Location</Text>
          </TouchableOpacity>
        </View>
        ) : ( <></> )}
        
        {/* List Component: will take in an array of section titles and an equal length, 2D array of elements that correspond to each section */}
        <View className='flex-1'>
          <ItemList isDark={isDark} elements={filteredListData} />
        </View>

      </ScreenContent>
    </Container>
  );
}
