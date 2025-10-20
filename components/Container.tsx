import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView 
      className="flex-1 bg-light-background dark:bg-dark-background"
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View className="flex-1 mx-6">
        {children}
      </View>
    </SafeAreaView>
  );
};
