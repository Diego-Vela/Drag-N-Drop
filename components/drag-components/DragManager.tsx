import React from 'react';
import { View, FlatList } from 'react-native';
import { DraggableUnit } from './DraggableUnit';
import { DropZone } from './DropZone';
import { useDropManager } from '../../hooks/drag-hooks';

export interface DropZoneData {
  id: string;
  label: string;
  sublabel?: string;
  units: string[];
}

interface DragManagerProps {
  isDark?: boolean;
  data: DropZoneData[];
  deadZoneMembers: DropZoneData;
}

export function DragManager({ isDark = false, data, deadZoneMembers }: DragManagerProps) {

  const {
    zones,
    deadZone,
    zoneRefs,
    unitRefs,
    unitInDropZoneShared,
    handleZoneMeasure,
    handleUnitDrop,
  } = useDropManager(data, deadZoneMembers);

  // --- Render zones with their current units ---
  return (
    <View className="flex-1 justify-between py-[16] px-[16]">
      <View className="flex-1">
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
              />
            ))}
          </DropZone>
        )}
      />
      </View>
      {<View>
          <DropZone
            ref={(el) => { zoneRefs.current[deadZone.id] = el; }}
            id={deadZone.id}
            label={deadZone.label}
            sublabel={deadZone.sublabel}
            isDeadZone
            onMeasure={handleZoneMeasure}
            isDark={isDark}
          >
            {deadZone &&
              deadZone.units.map((letter) => (
                <DraggableUnit
                  key={letter}
                  ref={(el) => { unitRefs.current[letter] = el; }}
                  label={letter}
                  onDragEnd={handleUnitDrop}
                  isDark={isDark}
                />
              ))}
          </DropZone>
        </View>}
    </View>
  );
}