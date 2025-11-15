import React from 'react';
import { View } from 'react-native';
import { Container, ScreenContent, SearchBar } from '../components';
import { useNewData, useTheme } from '../contexts';

export function SettingsScreen() {
  const { isDark } = useTheme();
  
  return (
    <Container headerTitle="Settings">
      <ScreenContent 
        title="Settings" 
        path="screens/SettingsScreen.tsx"
      />
        {/* Search Bar Component */}
        <View className='h-16 justify-center items-center my-4 mx-4'>
          <SearchBar isDark={isDark} onSearchChange={()=>{}}/>
        </View>
        {/* List Component */}
        <View className='flex-1 mx-4 bg-gray-300 rounded-t-lg'>

        </View>
    </Container>
  );
}