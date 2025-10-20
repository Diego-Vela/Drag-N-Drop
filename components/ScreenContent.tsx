import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';


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
    <>            
      {children}
    </>
  );
};
