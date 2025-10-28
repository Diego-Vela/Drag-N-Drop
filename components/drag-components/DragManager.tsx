//#region Imports
import React from 'react';
import { View, FlatList } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { StaticUnit } from './StaticUnit';
import { DropZone } from './DropZone';
import { useDropManager } from '../../hooks/drag-hooks';
import { DraggableOverlayUnit } from './DraggableOverlayUnit';

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

  //#region Overlay Style
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  }));


  //#region Render
  return (
    <View className="flex-1 justify-between py-[16] px-[16]">
      {/* Drop Zone List */}
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
        )}
        removeClippedSubviews
      />
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
          <Animated.View
            pointerEvents="none"
            style={[ overlayAnimatedStyle]}
          >
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