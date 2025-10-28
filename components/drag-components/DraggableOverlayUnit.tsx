import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

interface DraggableOverlayUnitProps {
  label: string;
  isDark?: boolean;
  x: SharedValue<number>;
  y: SharedValue<number>;
}

export function DraggableOverlayUnit({
  label,
  isDark = false,
  x,
  y,
}: DraggableOverlayUnitProps) {
  // Animated style based on gesture coordinates
  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    transform: [ { translateX: -65 }, { translateY: -140 }]
  }));

  return (
    <Animated.View style={animatedStyle} pointerEvents="none">
      <View
        className={`px-4 py-6 rounded-lg border-2 ${
          isDark
            ? 'bg-dark-warning/20 border-dark-highlight-accent'
            : 'bg-light-highlight border-light-highlight-accent'
        }`}
        style={{ width: '100%' }}
      >
        <Text
          className={`font-semibold text-sm text-left ${
            isDark
              ? 'text-dark-highlight-text'
              : 'text-light-highlight-text'
          }`}
        >
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}
