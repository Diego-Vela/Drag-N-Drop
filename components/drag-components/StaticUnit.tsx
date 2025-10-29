import React from 'react';
import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { StaticUnitProps } from '../../types';

const MIN_THRESHOLD = 12;

export function StaticUnit({ label, isDark=false, onDragStart, onDragMove, onDragEnd}: StaticUnitProps) {
  
  const hasStarted = useSharedValue(false);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const distance = Math.sqrt(e.translationX ** 2 + e.translationY ** 2);
      if (!hasStarted.value && distance > MIN_THRESHOLD) {
        hasStarted.value = true;
        runOnJS(onDragStart)?.(label);
      }
      if (hasStarted.value) {
        runOnJS(onDragMove)?.(label, { x: e.absoluteX, y: e.absoluteY });
      }
    })
    .onEnd((e) => {
      if (hasStarted.value) {
        runOnJS(onDragEnd)?.(label, { x: e.absoluteX, y: e.absoluteY });
      }
      hasStarted.value = false;
    })
    .onFinalize(() => {
      hasStarted.value = false;
    });

  return (
    <GestureDetector gesture={pan}>
      <View
        className={`px-4 py-6 rounded-lg border-2 h-15 ${
          isDark
            ? 'bg-dark-warning/20 border-dark-highlight-accent'
            : 'bg-light-highlight border-light-highlight-accent'
        }`}
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
    </GestureDetector>
  );
}
