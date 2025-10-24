import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';

// ---- small Render component ----
export function Unit({
  label,
  isDark,
  animatedStyle,
  unitRef,
}: {
  label: string;
  isDark: boolean;
  animatedStyle: any;
  pan: any;
  unitRef: any;
}) {
  return (
    <Animated.View
      ref={unitRef}
      className={`px-4 py-6 rounded-lg border-2 ${
        isDark
          ? 'bg-dark-warning/20 border-dark-highlight-accent'
          : 'bg-light-highlight border-light-highlight-accent'
      }`}
      style={[
        animatedStyle,
        {
          width: '100%',
        },
      ]}
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
    </Animated.View>
  );
}
