import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts';
import { DraggableUnit, DropZone } from './';


export function DragManager() {
  const { isDark } = useTheme();
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
  const [unitInfo, setUnitInfo] = useState<Record<string, any>>({});
  const [unitInDropZone, setUnitInDropZone] = useState(false);

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
        color={isDark ? '#2196F3' : '#8cc9ff'}
        size={120}
        isInDropZone={unitInDropZone}
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
