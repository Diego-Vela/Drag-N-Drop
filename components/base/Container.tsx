// Base Imports
import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
// Third-party Imports
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas, Rect, interpolateColors } from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
// Component Imports
import { Header } from './Header';
// Context Imports
import { useTheme } from '../../contexts/ThemeContext';

export const Container = ({ 
  children, 
  headerTitle,
  showHeader = true 
}: { 
  children: React.ReactNode;
  headerTitle?: string;
  showHeader?: boolean;
}) => {
  const { isDark } = useTheme();
  const { width, height } = Dimensions.get('window');
  
  // Animation progress value
  const progress = useSharedValue(isDark ? 1 : 0);
  
  // Animate when theme changes
  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, { duration: 200 });
  }, [isDark]);
  
  // Interpolate background color
  const animatedBackgroundColor = useDerivedValue(() => {
    return interpolateColors(
      progress.value,
      [0, 1],
      ['#e2e8f0', '#111827'] // slightly darker blue-gray background to dark-background
    );
  });
  
  return (
    <SafeAreaView 
      className="flex-1"
      edges={['top', 'left', 'right']}
      style={{ position: 'relative' }}
    >
      <Canvas style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          color={animatedBackgroundColor}
        />
      </Canvas>
      
      <View style={{ flex: 1, backgroundColor: 'transparent', overflow: 'visible' }}>
        {showHeader && <Header title={headerTitle} />}
        <View className="flex-1 mx-0" style={{ overflow: 'visible' }}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};