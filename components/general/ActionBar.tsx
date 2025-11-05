import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type ABProps = {
  isDark: boolean;
  handleButtonPress: () => void;
  handleAddButton: () => void;
}

export function ActionBar({isDark = false, handleButtonPress, handleAddButton}: ABProps) {
   const resetButtonTitle = 'RESET DB';
   const addButtonTitle = 'ADD';

  //#region Render
  return (
    <View className={`flex-row h-full w-full justify-evenly items-center`}>
      <TouchableOpacity className={`${isDark ? 'bg-yellow-800/40': 'bg-green-500'} rounded-xl h-[80%] w-[20%] justify-center items-center `} onPress={handleAddButton}> 
        <Text className={`${isDark ? 'text-white': 'text-white'}`}>
          {addButtonTitle}
        </Text> 
      </TouchableOpacity>
      <TouchableOpacity className={`${isDark ? 'bg-yellow-800/40': 'bg-light-accent'} rounded-xl h-[80%] w-[20%] justify-center items-center `} onPress={handleButtonPress}> 
        <Text className={`${isDark ? 'text-white': 'text-white'}`}>
          {resetButtonTitle}
        </Text> 
      </TouchableOpacity>
    </View>
  );
}
