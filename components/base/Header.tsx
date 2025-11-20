// Base Imports
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
// Third-party Imports
import { Canvas, Rect } from '@shopify/react-native-skia';
// Component Imports
import { ThemeToggle } from './ThemeToggle';
import { Hamburger } from './Hamburger';
// Context Imports
import { useTheme } from '../../contexts';

export const Header = ({ title = "Organization Name" }: { title?: string }) => {
  const { isDark } = useTheme();
  const { height, width } = Dimensions.get('window');

  // Static colors (no animation)
  const backgroundColor = isDark ? '#1f2937' : '#1e3a8a'; // dark surface or navy
  const borderColor = isDark ? '#374151' : '#1e40af';     // dark-border or navy-border

  return (
    <View style={{ position: 'relative', height: 85, zIndex: 500 }}>
      <Canvas style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Rect x={0} y={0} width={width} height={85} color={backgroundColor} />
        <Rect x={0} y={84} width={width} height={1} color={borderColor} />
      </Canvas>

      <View
        className="flex-row justify-between items-center py-4 px-4"
        style={{ height: 85, backgroundColor: 'transparent' }}
      >
        <Text
          className={`text-2xl font-bold ${
            isDark ? 'text-dark-primary' : 'text-white'
          }`}
        >
          {title}
        </Text>
        
        <Hamburger/>

        
      </View>
    </View>
  );
};