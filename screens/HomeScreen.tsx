import React, { useState, useEffect } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import { Container, ScreenContent, SearchBar, ActionBar } from '../components';
import { AssignmentContainer } from '../components/home-screen';
import { useTheme, useNewData, AssignmentObject, Unit } from '../contexts';
import { useSearchFilter, useHomeScreen } from '../hooks';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { RootStackParamList } from '../App';

const GroupName = 'Dashboard';

export function HomeScreen() {  
  //#region Hook Calls
  const { isDark } = useTheme();
  const { listData, handleEditButton } = useHomeScreen();
  
  const {
    query: listQuery,
    setQuery: setListQuery,
    filtered: filteredListData
  } = useSearchFilter(listData, { keys: ['key']});

  //#region Render
  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/HomeScreen.tsx">

        {/* Search Bar */}
        <View className='h-16 justify-center items-center mt-4 mx-4'>
          <SearchBar isDark={isDark} placeholder='Search for customer/locations/units, & for multi-query...' query={listQuery} onSearchChange={setListQuery}/>
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
