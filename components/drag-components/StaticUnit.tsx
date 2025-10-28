import React from 'react';
import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { StaticUnitProps } from '../../types';

export function StaticUnit({ label, isDark=false, onDragStart, onDragMove, onDragEnd }: StaticUnitProps) {
  
  const pan = Gesture.Pan()
    .onBegin(() => runOnJS(onDragStart)?.(label))
    .onUpdate((e) =>
      runOnJS(onDragMove)?.(label, { x: e.absoluteX, y: e.absoluteY })
    )
    .onEnd((e) =>
      runOnJS(onDragEnd)?.(label, { x: e.absoluteX, y: e.absoluteY })
    );

  return (
    <GestureDetector gesture={pan}>
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
    </GestureDetector>
  );
}
