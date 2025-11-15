import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { RefreshControl } from 'react-native-gesture-handler';

import { DropZone, StaticUnit, DraggableOverlayUnit } from './drag-components';
import { useDropManager, useSearchFilter } from '../../hooks';
import type { DragManagerProps } from '../../types';

import { SearchBar, ActionBar } from '../'; 

import { Ionicons } from '@expo/vector-icons';


export function DragManager({ isDark = false, data, deadZoneMembers, saveData = async (data:any) => {}, cancelDrag = () => {} }: DragManagerProps) {  
  //#region Hook
  const {
    zones,
    deadZone,
    zoneRefs,
    activeDrag,
    showDeadZone,
    overlayX,
    overlayY,
    isDragging,
    refreshing,
    handleZoneMeasure,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleTestButton,
    onRefresh,
    handleShowDeadZoneButton,
  } = useDropManager(data, deadZoneMembers);

  //#region Search hook
  // NOTE: zones contains the new data to pass back to the home screen.
  const {
    query: zoneQuery,
    setQuery: setZoneQuery,
    filtered: filteredZones,
  } = useSearchFilter(zones, { keys: ['label', 'sublabel', 'units']});

  const {
    query: unitQuery,
    setQuery: setUnitQuery,
    filtered: filteredUnits,
  } = useSearchFilter(deadZone.units);

  //#region Render
  return (
    <View className="flex-1 justify-between">
      {/* Zone Search Bar */}
      <View className="flex h-16 min-h-[5%] max-h-[7%] mt-4 mx-4 items-center justify-center rounded-lg">
        <SearchBar
          placeholder="Search zones, locations, or units..."
          query={zoneQuery}
          onSearchChange={setZoneQuery}
          isDark={isDark}
        />
      </View>

      {/* Action Bar */}
      <View className={`flex h-16 min-h-[5%] max-h-[7%] mx-4 items-center bg-transparent justify-center`}>
        <ActionBar isDark={isDark} buttons={['Save', 'Cancel', 'Test']} actions={[() => saveData(zones), cancelDrag, handleTestButton]}/>
      </View>

      {/* Scrollable Drop Zone List */}
      <ScrollView
        pointerEvents="auto"
        scrollEnabled={!isDragging}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ marginVertical: 12, marginHorizontal: 16 }}
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

      {/* DeadZone Visibility Bar */}
      <TouchableOpacity className={`
        flex mt-4 items-center justify-center self-center w-full rounded-t-lg 
          ${isDark 
            ? 'bg-gray-600'
            : 'bg-gray-300'}
          ${ showDeadZone ? 'h-4' : 'h-16'}
          `}
            
          onPress={handleShowDeadZoneButton}>
        <Ionicons name={showDeadZone ? 'chevron-down' : 'chevron-up'} size={16} color={isDark? '#ffffffff': '#585858ff'} />
      </TouchableOpacity>

      {/* Dead Zone Section */}
      {showDeadZone &&(
        <View className={`h-[28%] ${isDark ? 'bg-dark-surface/40' : 'bg-neutral-100/60'}`}>
          {/* Unassigned Unit Search Bar */}
          <View className="items-center justify-center self-center h-16 min-h-[5%] my-2 mx-4">
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
      )}

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