import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface DropZoneRef {
  measureNow: () => void;
}

interface DropZoneProps {
  id: string;
  onMeasure: (id: string, layout: { left: number; right: number; top: number; bottom: number }) => void;
  label?: string;
  isDark?: boolean;
  isDeadZone?: boolean;
  children?: React.ReactNode;
}

export const DropZone = forwardRef<DropZoneRef, DropZoneProps>(
({ id, onMeasure, label = 'Drop Zone', isDark = false, isDeadZone = false, children }, ref) => {
  const zoneRef = useRef<View>(null);

  const measureNow = () => {
    if (zoneRef.current) {
      zoneRef.current.measure((x, y, width, height, pageX, pageY) => {
        const left = pageX;
        const right = pageX + width;
        const top = pageY;
        const bottom = pageY + height;
        onMeasure(id, { left, right, top, bottom });
      });
    }
  };

  useImperativeHandle(ref, () => ({ measureNow }));

  function MeasureNowButton({ measureNow }: { measureNow: () => void }) {
    return (
      <TouchableOpacity className="bg-white h-5 w-12 mt-4" onPress={measureNow}/>
    )
  };

  function DropZoneLabelCard({ title, subtitle }: {title: string, subtitle: string }) {
    return (
      <View className="items-center">
        <View className={`p-4 rounded-lg shadow-sm border w-40 ${
          isDark ? 'bg-dark-surface border-dark-border' : 'bg-white border-light-border/20'
        }`}>
          <Text className={`font-bold text-sm ${isDark ? 'text-dark-primary' : 'text-light-primary'}`}>
            {title}
          </Text>
          <Text className={`text-xs mt-1 ${isDark ? 'text-dark-secondary' : 'text-light-secondary'}`}>
            {subtitle}
          </Text>
        </View>
        {/* Test Component */}
        {/*<MeasureNowButton measureNow={measureNow}/>*/}
      </View>
    )
  }

  return (
    <View
      ref={zoneRef}
      className={`flex-row mb-4 p-3 rounded-lg ${isDark ? 'bg-dark-surface/40' : 'bg-neutral-100/60'}`}
    >
      {/* Left Column: Title/Subtitle Pair */}
      <DropZoneLabelCard title={'Customer 1'} subtitle={'Location 1'}/>
      {/* Right Column: Units Flex Container - Single Column Centered */}
      <View className="ml-4 flex-1 gap-6 items-center justify-center">
        {children}
      </View>
    </View>
  );
});
