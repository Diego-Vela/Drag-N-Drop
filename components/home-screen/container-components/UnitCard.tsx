import { Unit } from '../../../contexts';
import { View, Text } from 'react-native';

interface UnitCardProps {
  unit: Unit;
  isUnassigned: boolean;
  isDark: boolean;
}

export function UnitCard({ unit, isUnassigned, isDark }: UnitCardProps) {
  return (
    <View
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
  );
}