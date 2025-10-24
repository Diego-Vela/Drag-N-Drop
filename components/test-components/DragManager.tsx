import React from 'react';
import { View, FlatList } from 'react-native';
import { useTheme } from '../../contexts';
import { DraggableUnit } from './DraggableUnit';
import { DropZone } from './DropZone';
import { useDropManager } from '../../hooks';

export interface DropZoneData {
  id: string;
  label: string;
  sublabel?: string;
  units: string[];
}

interface DragManagerProps {
  isDark?: boolean;
  data: DropZoneData[];
}

export function DragManager({ isDark = false, data }: DragManagerProps) {

  const {
    zones,
    zoneRefs,
    unitRefs,
    unitInDropZoneShared,
    handleZoneMeasure,
    handleUnitDrop,
  } = useDropManager(data);

  // --- Render zones with their current units ---
  return (
    <View className="py-[16] px-[16]">
      <FlatList
        data={zones}
        keyExtractor={(z) => z.id}
        renderItem={({ item: zone }) => (
          <DropZone
            ref={(el) => { zoneRefs.current[zone.id] = el; }}
            id={zone.id}
            label={zone.label}
            sublabel={zone.sublabel}
            onMeasure={handleZoneMeasure}
            isDark={isDark}
          >
            {zone.units.map((letter) => (
              <DraggableUnit
                key={letter}
                ref={(el) => { unitRefs.current[letter] = el; }}
                label={letter}
                onDragEnd={handleUnitDrop}
                isDark={isDark}
                isInDropZoneShared={unitInDropZoneShared}
              />
            ))}
          </DropZone>
        )}
      />
    </View>
  );
}