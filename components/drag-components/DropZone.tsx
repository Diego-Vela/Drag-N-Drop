import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DropZoneRef, DropZoneProps } from '../../types';
import { DropZoneLabelCard } from './DropZoneLabelCard';
import { useDropZone } from '../../hooks';

export const DropZone = forwardRef<DropZoneRef, DropZoneProps>(
  (
    {
      id,
      onMeasure,
      label = 'Drop Zone',
      sublabel = 'Drop Here',
      isDark = false,
      isDeadZone = false,
      children,
    },
    ref
  ) => {
    // ✨ Extracted measurement logic
    const { zoneRef, measureNow } = useDropZone(id, onMeasure, ref);

    function MeasureNowButton() {
      return (
        <TouchableOpacity className="bg-white h-5 w-12 mt-4" onPress={measureNow} />
      );
    }

    return (
      <>
        {isDeadZone ? (
          <View
            ref={zoneRef}
            onLayout={measureNow}
            className={`flex-col rounded-lg min-h-[30%] max-h-120 justify-center items-start ${
              isDark ? 'bg-dark-surface/40' : 'bg-black'
            }`}
          >
            <View className="flex-row items-center justify-center mx-4">
              {children}
            </View>
          </View>
        ) : (
          <View
            ref={zoneRef}
            onLayout={measureNow}
            className={`flex-row mb-8 p-3 rounded-lg  ${
              isDark ? 'bg-dark-surface/40' : 'bg-neutral-100/60'
            }`}
          >
            <DropZoneLabelCard title={label} subtitle={sublabel} isDark={isDark} />
            <View className="ml-4 flex-1 gap-6 items-center justify-center">
              {children}
            </View>
          </View>
        )}
      </>
    );
  }
);
