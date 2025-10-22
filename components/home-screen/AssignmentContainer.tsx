// Base Imports
import React from 'react';
import { View, Text } from 'react-native';
import { Unit } from '../../contexts';

interface AssignmentContainerProps {
  title: string;
  subtitle: string;
  units: Unit[];
  isDark: boolean;
  isUnassigned?: boolean;
}

export function AssignmentContainer({ title, subtitle, units, isDark, isUnassigned = false }: AssignmentContainerProps) {

  return (
    <View className={`flex-row mb-4 p-3 rounded-lg ${
      isDark 
        ? 'bg-dark-surface/40' 
        : 'bg-neutral-100/60'
    }`}>
      {/* Left Column: Title/Subtitle Pair */}
      <View className="items-center">
        <View className={`p-4 rounded-lg shadow-sm border w-40 ${
          isDark 
            ? 'bg-dark-surface border-dark-border' 
            : 'bg-white border-light-border/20'
        }`}>
          <Text className={`font-bold text-sm ${
            isDark ? 'text-dark-primary' : 'text-light-primary'
          }`}>
            {title}
          </Text>
          <Text className={`text-xs mt-1 ${
            isDark ? 'text-dark-secondary' : 'text-light-secondary'
          }`}>
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Right Column: Units Flex Container - Single Column Centered */}
      <View className="ml-4 flex-1 items-center justify-center">
        <View className="flex-1 flex-col gap-6 mb-4 w-full">
          {units.map((unit) => (
            <View
              key={unit.name}
              className={`px-4 py-6 rounded-lg  ${
                isUnassigned
                  ? `border-2 border-dashed ${
                      isDark 
                        ? 'bg-dark-background border-dark-border' 
                        : 'bg-neutral-100 border-neutral-400'
                    }`
                  : `border-2 ${
                      isDark 
                        ? 'bg-dark-warning/20 border-dark-highlight-accent' 
                        : 'bg-light-highlight border-light-highlight-accent'
                    }`
              }`}
            >
              <Text className={`font-semibold text-sm ${
                isUnassigned 
                  ? `text-left ${isDark ? 'text-dark-secondary' : 'text-neutral-600'}`
                  : isDark ? 'text-dark-highlight-text' : 'text-light-highlight-text'
              }`}>
                {unit.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}