import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, ScreenContent } from '../components/base';
import { useTheme } from '../contexts';
import { DraggableUnit, DropZone } from '../components/test-components';

const GroupName = 'Edit Dashboard';

export function EditScreen() {
  const { isDark } = useTheme();
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
  const [unitInfo, setUnitInfo] = useState<Record<string, any>>({});

  const handleZoneMeasure = (id: string, layout: any) => {
    setZoneInfo((prev) => ({ ...prev, [id]: layout }));
    console.log(zoneInfo);
  };

  const handleUnitMeasure = (id: string, layout: any) => {
    setUnitInfo((prev) => ({ ...prev, [id]: layout }));
    console.log(unitInfo);
  }

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
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
          />
          <DraggableUnit
            label="Drag2"
            onMeasure={handleUnitMeasure}
            color={isDark ?  '#8cc9ff': '#2196F3'}
            size={120}
          />
        </View>
      </ScreenContent>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
