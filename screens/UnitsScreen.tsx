import React, { useState } from 'react';
import { View } from 'react-native';
import { Container, ScreenContent, SearchBar, ActionBar, ItemList } from '../components';
import { useNewData, useTheme } from '../contexts';

export function UnitsScreen() {
  const { isDark } = useTheme();
  const { units, locations } = useNewData();

  const [unitName, setUnitName] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Container headerTitle="Units">
      <ScreenContent title="Units" path="screens/UnitsScreen.tsx"/>

        {/* Search Bar Component */}
        <View className='h-16 justify-center items-center mt-4 mx-4'>
          <SearchBar isDark={isDark} onSearchChange={()=>{}}/>
        </View>

        {/* Action Bar Reservation */}
        <View className={`h-16 mx-4 my-2 rounded-xl overflow-hidden`}>
          <ActionBar isDark={isDark} handleButtonPress={()=>{}} handleAddButton={()=>{}}/>
        </View>

        {/* List Component: will take in an array of section titles and an equal length, 2D array of elements that correspond to each section */}
        <View className='flex-1'>
          <ItemList isDark={isDark} /*elements={listData}*/ />
        </View>

    </Container>
  );
}