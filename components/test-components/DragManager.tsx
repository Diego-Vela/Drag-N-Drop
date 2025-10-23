import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../../contexts';
import { DraggableUnit}  from './DraggableUnit';
import { DropZone } from './DropZone';


export function DragManager() {
  const { isDark } = useTheme();
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
  const [unitInfo, setUnitInfo] = useState<Record<string, any>>({});
  const [unitInDropZone, setUnitInDropZone] = useState(false);
  const unitInDropZoneShared = useSharedValue(false);

  const handleZoneMeasure = useCallback((id: string, layout: any) => {
    setZoneInfo((prev) => {
      const updated = { ...prev, [id]: layout };
      return updated;
    });
  }, []);

  const handleUnitMeasure = useCallback((id: string, layout: any) => {
    setUnitInfo((prev) => {
      const updated = { ...prev, [id]: layout };
      return updated;
    });
  }, []);

  const handleUnitDrop = useCallback(
    (id: string, position: { x: number; y: number }) => {
      const zone = zoneInfo['zone1'];
      if (!zone) return;

      const { left, right, top, bottom } = zone;
      const inside =
        position.x >= left &&
        position.x <= right &&
        position.y >= top &&
        position.y <= bottom;
      console.log(position);
      console.log(zone);

      console.log(inside ? `✅ ${id} is inside Drop Zone` : `❌ ${id} is outside Drop Zone`);

      setUnitInDropZone(inside);
      unitInDropZoneShared.value = inside;
    },
    [zoneInfo]
  );

  return (
    <View className='py-[16] px-[16]'>
      <DropZone
        id="zone1"
        onMeasure={handleZoneMeasure}
        label="Drop Zone"
        isDark={isDark}
      />
      <DraggableUnit
        label="Unit A"
        onMeasure={handleUnitMeasure}
        onDragEnd={handleUnitDrop} // NEW
        isDark={isDark}
        size={80}
        isInDropZone={unitInDropZone}
        isInDropZoneShared={unitInDropZoneShared}
      />
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
