//#region Imports
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { StaticUnit } from './StaticUnit';
import { DropZone } from './DropZone';
import { useDropManager } from '../../hooks/drag-hooks';
import { DraggableOverlayUnit } from './DraggableOverlayUnit';
import { RefreshControl } from 'react-native-gesture-handler';

//#region MOVE TO TYPES
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
  //#region Hook
  const {
    zones,
    deadZone,
    zoneRefs,
    activeDrag,
    overlayX,
    overlayY,
    handleZoneMeasure,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  } = useDropManager(data, deadZoneMembers);

  //#region TODO
  // Add functionality to refresh
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {};
  // zones contains the new data to pass back to the home screen.

  //#region Render
  return (
    <View className="flex-1 justify-between py-[16] px-[16]">
      {/* Drop Zone List */}
      <ScrollView
        pointerEvents='auto'
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {zones.map((zone) => (
          <DropZone
            key={zone.id}
            ref={(el) => { zoneRefs.current[zone.id] = el; }}
            id={zone.id}
            label={zone.label}
            sublabel={zone.sublabel}
            onMeasure={handleZoneMeasure}
            isDark={isDark}
          >
            {zone.units.map((letter) => (
              <StaticUnit
                key={letter}
                label={letter}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                isDark={isDark}
              />
            ))}
          </DropZone>
        ))}
      </ScrollView>
      {/* Dead Zone */}
      <View className="h-[30%] mt-4">
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
                <StaticUnit
                  key={letter}
                  label={letter}
                  isDark={isDark}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
              ))}
          </DropZone>
        </View>

        {/* Overlay Draggable Units */}
        {activeDrag && (
          <Animated.View pointerEvents="none" className='absolute inset-0 z-[999]'>
            <DraggableOverlayUnit
              label={activeDrag}
              isDark={isDark}
              x={overlayX}
              y={overlayY}
            />
          </Animated.View>
        )}
    </View>
  );
}