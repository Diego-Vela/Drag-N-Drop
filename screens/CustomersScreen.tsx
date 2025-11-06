import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Container, ScreenContent, SearchBar, ItemList, ActionBar } from '../components';
import { useNewData, useTheme } from '../contexts';

import type { ListGroup, ListElement } from '../components';

export function CustomersScreen() {
  const { isDark } = useTheme();
  const { customers, locations, addCustomerLocationPair, dropAllTables, refetch } = useNewData();

  const [customerName, setCustomerName] = useState('');
  const [locationName, setLocationName] = useState('');

  const [canEdit, setCanEdit] = useState(false);
  
  //#region Functions
  // Refresh Functionality to help
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResetButton = async () => {
    dropAllTables();
    Alert.alert('Pressed!', '💣 YOU JUST BOOMED THE DATABASE!!!.');
    await refetch();
    setRefreshKey((prev) => prev + 1);
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
    } else {
      console.log('Error', 'Failed to add entry. Check logs for details.');
    }

    refetch();
    setRefreshKey((prev) => prev + 1);
    setCanEdit(false);
  };


  // Helper function to map to list ready data - Memoized to not recalc on every render
  const listData: ListGroup[] = useMemo(() => {
    if (!customers || !locations) return [];
    return customers.map((customer) => {
      const customerLocations = locations.filter(
        (loc) => loc.customerId === customer.id
      );

      const elements: ListElement[] = customerLocations.map((loc) => ({
        label: loc.name,        
        sublabel: customer.name 
      }));

      return {
        label: customer.name,
        elements,
      };
    });
  }, [customers, locations]);

  //#region Render
  return (
    <Container headerTitle="Customer/Locations">
      <ScreenContent title="Customers" path="screens/CustomersScreen.tsx">
      
        {/* Search Bar Component */}
        <View className='h-16 justify-center items-center mt-4 mx-4'>
          <SearchBar isDark={isDark} onSearchChange={()=>{}}/>
        </View>

        {/* Action Bar Reservation */}
        <View className={`h-16 mx-4 my-2 rounded-xl overflow-hidden`}>
          <ActionBar isDark={isDark} handleButtonPress={handleResetButton} handleAddButton={handleAddButton}/>
        </View>
        
        {/* List Component: will take in an array of section titles and an equal length, 2D array of elements that correspond to each section */}
        <View className='flex-1'>
          <ItemList isDark={isDark} elements={listData} />
        </View>

        {/* Temp Section to Add New Customer Locations */}
        {canEdit ? ( 
        <View className={`h-48 mx-4 p-4`}>
          <TextInput
            placeholder="Customer Name"
            value={customerName}
            onChangeText={setCustomerName}
            className="bg-white p-3 rounded-md w-full mb-3"
          />
          <TextInput
            placeholder="Location Name"
            value={locationName}
            onChangeText={setLocationName}
            className="bg-white p-3 rounded-md w-full mb-3"
          />
          <TouchableOpacity
            onPress={handleAdd}
            className="bg-blue-500 px-6 py-3 rounded-lg"
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg font-semibold">Add Customer - Location</Text>
          </TouchableOpacity>
        </View>
        ) : ( <></> )}

      </ScreenContent>
    </Container>
  );
}
