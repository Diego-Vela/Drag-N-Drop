import React, { useEffect } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { Canvas, Rect, RoundedRect, interpolateColors } from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

export function HomeScreen() {
  const { isDark } = useTheme();
  const { width, height } = Dimensions.get('window');
  
  // Animation progress value
  const progress = useSharedValue(isDark ? 1 : 0);
  
  // Animate when theme changes
  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, { duration: 800 });
  }, [isDark]);
  
  // Interpolate background color
  const animatedBackgroundColor = useDerivedValue(() => {
    return interpolateColors(
      progress.value,
      [0, 1],
      ['#ffffff', '#111827'] // light-background to dark-background
    );
  });
  
  // Interpolate surface color
  const animatedSurfaceColor = useDerivedValue(() => {
    return interpolateColors(
      progress.value,
      [0, 1],
      ['#f9fafb', '#1f2937'] // light-surface to dark-surface
    );
  });

  return (
    <View className="flex-1 items-center justify-center p-6" style={{ position: 'relative' }}>
      {/* Animated Background using Skia Canvas */}
      <Canvas style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          color={animatedBackgroundColor}
        />
      </Canvas>
      
      <ThemeToggle/>
      
      {/* Content Card with Animated Background */}
      <View style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
        <Canvas 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            borderRadius: 8
          }}
        >
          <RoundedRect
            x={0}
            y={0}
            width={400}
            height={250}
            r={8}
            color={animatedSurfaceColor}
          />
        </Canvas>
        
        <View className="p-6 rounded-lg border border-light-border dark:border-dark-border" style={{ backgroundColor: 'transparent' }}>
          <Text 
            className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-dark-primary' : 'text-light-primary'
            }`}
          >
            Business Dashboard
          </Text>
          <Text 
            className={`text-base mb-4 ${
              isDark ? 'text-dark-secondary' : 'text-light-secondary'
            }`}
          >
            Professional theme with smooth animations
          </Text>
        </View>
      </View>
    </View>
  );
}