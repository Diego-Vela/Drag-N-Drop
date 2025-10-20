import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

export function AssignmentsScreen() {
  const { isDark } = useTheme();

  return (
    <View className="flex-1 bg-light-background dark:bg-dark-background">
      <View className="flex-1 items-center justify-center p-6">
        <ThemeToggle />
        
        <View className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-light-border dark:border-dark-border shadow-business mt-6 w-full max-w-sm">
          <Text 
            className={`text-2xl font-bold mb-4 text-center ${
              isDark ? 'text-dark-primary' : 'text-light-primary'
            }`}
          >
            Assignments
          </Text>
          <Text 
            className={`text-base text-center ${
              isDark ? 'text-dark-secondary' : 'text-light-secondary'
            }`}
          >
            Manage unit assignments and paperwork
          </Text>
        </View>
      </View>
    </View>
  );
}