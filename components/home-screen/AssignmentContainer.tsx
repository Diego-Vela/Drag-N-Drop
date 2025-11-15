// Base Imports
import React from 'react';
import { View } from 'react-native';
import { PairCard, RouterUnitCard, UnitCard } from './container-components';
import { Customer, Location, Unit } from '../../contexts';

interface AssignmentContainerProps {
  title: Location;
  subtitle: Customer;
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
        <PairCard title={title.name} subtitle={subtitle.name} isDark={isDark} />
      </View>

      {/* Right Column: Units Flex Container - Single Column Centered */}
        <View className=" mx-4 flex-1 flex-row flex-wrap gap-4 items-center justify-start">
          {units.map((unit) =>
            isUnassigned
              ? (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  isUnassigned={isUnassigned}
                  isDark={isDark}
                />
              )
              : (
                <RouterUnitCard
                  key={unit.id}
                  unit={unit}
                  isUnassigned={isUnassigned}
                  isDark={isDark}
                  location={title}
                  customer={subtitle}
                />
              )
          )}
      </View>
    </View>
  );
}