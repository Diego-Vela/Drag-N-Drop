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

      console.log(inside ? `✅ ${id} is inside Drop Zone` : `❌ ${id} is outside Drop Zone`);

      setUnitInDropZone(inside);
      unitInDropZoneShared.value = inside;
    },
    [zoneInfo]
  );

  return (
    <View style={styles.container}>
      <DropZone
        id="zone1"
        onMeasure={handleZoneMeasure}
        color={isDark ? '#444' : '#e0e0e0'}
        label="Drop Zone"
      />
      <DraggableUnit
        label="Drag1"
        onMeasure={handleUnitMeasure}
        onDragEnd={handleUnitDrop} // NEW
        color={isDark ? '#2196F3' : '#8cc9ff'}
        size={120}
        isInDropZone={unitInDropZone}
        isInDropZoneShared={unitInDropZoneShared}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
