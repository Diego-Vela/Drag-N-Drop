import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../../contexts';
import { DraggableUnit, UnitRef}  from './DraggableUnit';
import { DropZone, DropZoneRef } from './DropZone';

export function DragManager() {
  // Context
  const { isDark } = useTheme();
  // Zone
  const zoneRef = useRef<DropZoneRef>(null);
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
  // Units
  const unitRefs = useRef<Record<string, UnitRef | null>>({});
  const [unitInDropZone, setUnitInDropZone] = useState(false);
  const unitInDropZoneShared = useSharedValue(false);

  const handleZoneMeasure = useCallback((id: string, layout: any) => {
    setZoneInfo(prev => ({ ...prev, [id]: layout }));
  }, []);

  const handleUnitDrop = useCallback((id: string, position: { x: number; y: number }) => {
    zoneRef.current?.measureNow();
    console.log(zoneInfo['zone1']);

    const zone = zoneInfo['zone1'];
    if (!zone) {
      console.warn('⏳ Zone info not ready yet, ignoring first drop.');
      // Spring back immediately so the unit never sticks
      unitRefs.current[id]?.resetPosition?.();
      return;
}

    const { left, right, top, bottom } = zone;
    const inside =
      position.x >= left && position.x <= right &&
      position.y >= top && position.y <= bottom;

    //console.log('Received drop event from', id, position);
    console.log(inside ? `✅ ${id} is inside Drop Zone` : `❌ ${id} is outside Drop Zone`);

    //NEW: Functionalities for Spring
    if (inside) {
      unitInDropZoneShared.value = true;
    } else {
      unitInDropZoneShared.value = false;
      // reset the unit that failed
      unitRefs.current[id]?.resetPosition?.();
}

    setUnitInDropZone(inside);
    unitInDropZoneShared.value = inside;
  }, [zoneInfo]);

  return (
    <View className='py-[16] px-[16]'>
      <DropZone
        ref={zoneRef}
        id="zone1"
        onMeasure={handleZoneMeasure}
        label="Drop Zone"
        isDark={isDark}
      >
        <DraggableUnit
          ref={(el) => { unitRefs.current['Unit A'] = el; }} 
          label="Unit A"
          onDragEnd={handleUnitDrop}
          isDark={isDark}
          isInDropZoneShared={unitInDropZoneShared}
        />
      </DropZone>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
