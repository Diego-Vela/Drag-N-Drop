import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { RefreshControl } from 'react-native-gesture-handler';

import { DropZone, StaticUnit, DraggableOverlayUnit } from './drag-components';
import { useDropManager } from '../../hooks/drag-hooks';
import type { DragManagerProps } from '../../types';

import { SearchBar } from '../general/SearchBar'; 


export function DragManager({ isDark = false, data, deadZoneMembers }: DragManagerProps) {  
  //#region Hook
  const {
    zones,
    deadZone,
    zoneRefs,
    activeDrag,
    overlayX,
    overlayY,
    isDragging,
    refreshing,
    handleZoneMeasure,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    onRefresh,
  } = useDropManager(data, deadZoneMembers);

  //#region Temp Logic
  // NOTE: zones contains the new data to pass back to the home screen.

  //#region Render
  return (
    <View className="flex-1 justify-between py-[16] px-[16]">
      {/* Drop Zone List */}
      <ScrollView
        pointerEvents='auto'
        scrollEnabled={!isDragging}
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
          <View className='flex items-center justify-center self-center bg-green-300 h-[5%] w-full'>
            <Text className='text-xs text-center'>Optional ReSize Bar</Text>
          </View>
          <View className='flex items-center justify-center self-center bg-yellow-300 h-[20%] w-full'>
            <SearchBar data={''}/>
          </View>
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