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
      <DropZone
        ref={(el) => { zoneRefs.current['DeadZone'] = el; }}
        id={'DeadZone'}
        label={'DeadZone'}
        sublabel={'DeadZone'}
        isDeadZone={true}
        onMeasure={handleZoneMeasure}
        isDark={isDark}
      >
              <DraggableUnit
                key={'A'}
                ref={(el) => { unitRefs.current['A'] = el; }}
                label={'A'}
                onDragEnd={handleUnitDrop}
                isDark={isDark}
              />
                            <DraggableUnit
                key={'B'}
                ref={(el) => { unitRefs.current['B'] = el; }}
                label={'B'}
                onDragEnd={handleUnitDrop}
                isDark={isDark}
              />
      </DropZone>
    </View>
  );
}