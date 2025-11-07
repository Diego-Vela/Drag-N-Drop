import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { RefreshControl } from 'react-native-gesture-handler';

import { DropZone, StaticUnit, DraggableOverlayUnit } from './drag-components';
import { useDropManager, useSearchFilter } from '../../hooks';
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

  //#region Search hook
  // NOTE: zones contains the new data to pass back to the home screen.
  const {
    query: zoneQuery,
    setQuery: setZoneQuery,
    filtered: filteredZones,
  } = useSearchFilter(zones, { keys: ['label', 'sublabel', 'units'], fuzzy: true });

  const {
    query: unitQuery,
    setQuery: setUnitQuery,
    filtered: filteredUnits,
  } = useSearchFilter(deadZone.units);

  //#region Render
  return (
    <View className="flex-1 justify-between px-[16]">
      {/* Zone Search Bar */}
      <View className="w-full h-16 min-h-[5%] max-h-[7%] my-4 items-center justify-center rounded-lg">
        <SearchBar
          placeholder="Search zones, locations, or units..."
          query={zoneQuery}
          onSearchChange={setZoneQuery}
          isDark={isDark}
        />
      </View>

      {/* Scrollable Drop Zone List */}
      <ScrollView
        pointerEvents="auto"
        scrollEnabled={!isDragging}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ marginVertical: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredZones.map((zone) => (
          <DropZone
            key={zone.id}
            ref={(el) => {
              zoneRefs.current[zone.id] = el;
            }}
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

      {/* Dead Zone Section */}
      <View className={`h-[30%] mt-4 rounded-t-lg ${isDark ? 'bg-dark-surface/40' : 'bg-neutral-100/60'}`}>
        <View className={`flex items-center justify-center mb-2 self-center h-[5%] w-full rounded-t-lg`}>
          <Text className="text-xs text-center">^Resize Bar^</Text>
        </View>

        {/* Unassigned Unit Search Bar */}
        <View className="items-center justify-center self-center h-16 min-h-[5%] mx-4 rounded-lg">
          <SearchBar
            placeholder="Search unassigned units..."
            query={unitQuery}
            onSearchChange={setUnitQuery}
            isDark={isDark}
          />
        </View>

        {/* Filtered Dead Zone Units */}
        <DropZone
          ref={(el) => {
            zoneRefs.current[deadZone.id] = el;
          }}
          id={deadZone.id}
          label={deadZone.label}
          sublabel={deadZone.sublabel}
          isDeadZone
          onMeasure={handleZoneMeasure}
          isDark={isDark}
        >
          {filteredUnits.map((letter) => (
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

      {/* Overlay for Active Drag */}
      {activeDrag && (
        <Animated.View
          pointerEvents="none"
          className="absolute inset-0 z-[999]"
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