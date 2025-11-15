import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

export type ActionBarProps = {
  isDark?: boolean;
  buttons?: string[];
  actions?: (() => void)[];
  color?: string;
};

export function ActionBar({
  isDark = false,
  buttons = [],
  actions = [],
  color = 'bg-blue-500',
}: ActionBarProps) {
  
  // Verify lengths
  if (buttons.length > actions.length) {
    console.warn(
      `[ActionBar] Warning: buttons.length (${buttons.length}) > actions.length (${actions.length}). Extra buttons will have no action.`
    );
  }

  // --- Combine pairs up to the max of both
  const max = Math.max(buttons.length, actions.length);
  const buttonList = Array.from({ length: max }, (_, i) => ({
    label: buttons[i] ?? '',
    onPress: actions[i] ?? (() => Alert.alert('No action assigned')),
  }));

  return (
    <View className="flex-row w-full justify-evenly items-center pt-2">
      {buttonList.map((btn, index) => (
        <TouchableOpacity
          key={index}
          className={`${color} rounded-xl h-full w-[20%] justify-center items-center ${
            isDark ? 'opacity-80' : ''
          }`}
          onPress={btn.onPress}
          disabled={!btn.label}
        >
          <Text
            className={`text-white text-center ${
              btn.label ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {btn.label || '—'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
