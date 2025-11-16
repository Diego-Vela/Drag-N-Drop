import React from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';


type ScreenContentProps = {
  title: string;
  path?: string; // Make optional for production
  children?: React.ReactNode;
  showDevInfo?: boolean; // Control dev info display
};

export const ScreenContent = ({ 
  children 
}: ScreenContentProps) => {
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className='flex-1 flex'>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};
