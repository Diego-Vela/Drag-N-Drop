/* Legacy Style
import React from 'react';
import { Text, View } from 'react-native';

// ---- Consistent Unit Style ----
export function Unit({
  label,
  isDark,
  unitRef=null,
}: {
  label: string;
  isDark: boolean;
  unitRef?: any;
}) {
  return (
    <View
      ref={unitRef}
      className={`px-4 py-6 rounded-lg border-2 ${
        isDark
          ? 'bg-dark-warning/20 border-dark-highlight-accent'
          : 'bg-light-highlight border-light-highlight-accent'
      }`}
      style={[
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
    </View>
  );
}
  */
