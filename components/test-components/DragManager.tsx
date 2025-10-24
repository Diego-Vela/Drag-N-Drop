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
  const zoneRefs = useRef<Record<string, DropZoneRef | null>>({});
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
  // Units
  const unitRefs = useRef<Record<string, UnitRef | null>>({});
  const [unitInDropZone, setUnitInDropZone] = useState(false);
  const unitInDropZoneShared = useSharedValue(false);

  const handleZoneMeasure = useCallback((id: string, layout: any) => {
    setZoneInfo(prev => ({ ...prev, [id]: layout }));
  }, []);

  // Use Effect to get laid out values after 2 frames
  useEffect(() => {
    let f1: number, f2: number;
    f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(() => {
        Object.values(zoneRefs.current).forEach(ref => ref?.measureNow?.());
      });
    });
    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
    };
  }, []);

  const handleUnitDrop = useCallback((id: string, position: { x: number; y: number }) => {
    // Refresh all zone measurements before check
    Object.values(zoneRefs.current).forEach(ref => ref?.measureNow?.());

    if (Object.keys(zoneInfo).length === 0) {
      console.warn('⏳ Zones not ready yet, springing back.');
      unitRefs.current[id]?.resetPosition?.();
      return;
    }

    let insideZoneId: string | null = null;

    for (const [zoneId, { left, right, top, bottom }] of Object.entries(zoneInfo)) {
      const inside =
        position.x >= left &&
        position.x <= right &&
        position.y >= top &&
        position.y <= bottom;

      if (inside) {
        insideZoneId = zoneId;
        break;
      }
    }

    if (insideZoneId) {
      console.log(`✅ ${id} dropped inside ${insideZoneId}`);
      unitInDropZoneShared.value = true;
      // Later you can update which zone owns which unit here
    } else {
      console.log(`❌ ${id} not inside any zone`);
      unitInDropZoneShared.value = false;
      unitRefs.current[id]?.resetPosition?.();
    }
  }, [zoneInfo]);

  return (
    <View className='py-[16] px-[16]'>
      <DropZone
        ref={el => {zoneRefs.current['zone1'] = el;}}
        id="zone1"
        onMeasure={handleZoneMeasure}
        isDark={isDark}
      >
        {['A', 'B', 'C', 'D', 'E'].map((letter) => (
          <DraggableUnit
            key={letter}
            ref={(el) => { unitRefs.current[`Unit ${letter}`] = el; }}
            label={`Unit ${letter}`}
            onDragEnd={handleUnitDrop}
            isDark={isDark}
          />
        ))}
      </DropZone>
      <DropZone
        ref={el => { zoneRefs.current['zone2'] = el; }}
        id="zone2"
        onMeasure={handleZoneMeasure}
        isDark={isDark}
      >
          {['F'].map((letter) => (
            <DraggableUnit
              key={letter}
              ref={(el) => { unitRefs.current[`Unit ${letter}`] = el; }}
              label={`Unit ${letter}`}
              onDragEnd={handleUnitDrop}
              isDark={isDark}
            />
          ))}
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
