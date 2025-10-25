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
      <View
        ref={zoneRef}
        onLayout={measureNow}
        className={`flex-row ${isDeadZone ? '' : 'mb-4'} p-3 rounded-lg ${
          isDark ? 'bg-dark-surface/40' : 'bg-neutral-100/60'
        }`}
      >
        {/*isDeadZone ? (
          <View
            className={`
              flex-col items-center justify-center rounded-xl border-2 border-dashed
              ${
                isDark
                  ? 'border-red-400/60 bg-red-900/10'
                  : 'border-red-400/50 bg-red-50'
              }
              py-4 px-2 w-full
            `}
          >
            <Text
              className={`
                font-semibold text-sm mb-2
                ${isDark ? 'text-red-300' : 'text-red-600'}
              `}
            >
              {label || 'Unassigned Units'}
            </Text>
              <View className="flex-row gap-3 justify-center items-center w-[60%]">
                {children}
              </View>

            <Text
              className={`text-[10px] mt-2 italic ${
                isDark ? 'text-red-400/70' : 'text-red-600/70'
              }`}
            >
              {sublabel || 'Drop units here to unassign'}
            </Text>
          </View>
        ) : (*/}
          
          <>
            <DropZoneLabelCard title={label} subtitle={sublabel} isDark={isDark} />
            <View className="ml-4 flex-1 gap-6 items-center justify-center">
              {children}
            </View>
          </>
        {/*})}*/}
      </View>
    );
  }
);
