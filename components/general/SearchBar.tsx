import React from 'react';
import { View, Text } from 'react-native';

export function SearchBar({data}: {data: any}) {
  const filterFunction = (data: any) => {
    //Logic to filter data in real time.
  }

  return (
    <View className='h-full w-full bg-blue-300'>  
      <Text> Search by unit </Text>
    </View>
  )
}