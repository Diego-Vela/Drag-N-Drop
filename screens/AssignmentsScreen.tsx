import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Container, ScreenContent, SearchBar } from '../components';
import { useNewData, useTheme } from '../contexts';

export function AssignmentsScreen() {
  const { isDark } = useTheme();

  return (
    <Container headerTitle="Assignments">
      <ScreenContent title="Assignments" path="screens/AssignmentsScreen.tsx">
        {/* Search Bar Component */}
        <View className='h-16 justify-center items-center my-4'>
          <SearchBar isDark={isDark} onSearchChange={()=>{}}/>
        </View>
        {/* List Component */}
        <View className='flex-1 mx-4 bg-gray-300 rounded-t-lg'>

        </View>
      </ScreenContent>
    </Container>
  );
}
