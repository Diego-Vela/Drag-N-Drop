import React, { forwardRef } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { DropZoneRef, DropZoneProps } from '../../types';
import { useDropZone } from '../../hooks';

export const DropZone = forwardRef<DropZoneRef, DropZoneProps>(
  ({ id, onMeasure, label = 'Drop Zone', sublabel = 'Drop Here', isDark = false, isDeadZone = false, children }, ref ) => {
    
    const { zoneRef, measureNow } = useDropZone(id, onMeasure, ref);

    return (
      <>
        {isDeadZone ? (
          <View
            ref={zoneRef}
            onLayout={measureNow}
            className={`flex-col h-full justify-center items-start w-full ${
              isDark ? 'bg-dark-surface/40' : 'bg-orange-300'
            }`}
          >
            <View className='flex items-center justify-center self-center bg-green-300 h-[5%] w-full'>
              <Text className='text-xs text-center'>Optional ReSize Bar</Text>
            </View>
            <View className='flex items-center justify-center self-center bg-yellow-300 h-[20%] w-full'>
              <Text className='text-lg text-center'>SearchBar Component</Text>
            </View>
            <ScrollView
              contentContainerStyle={{
                flexDirection: 'column',  
                flexWrap: 'wrap',
                gap: 16,
                margin: 12,
                justifyContent: 'center',
                
              }}
              horizontal={true}
              
            > 
              {children}
            </ScrollView>
          </View>
        ) : (
          <View
            ref={zoneRef}
            onLayout={measureNow}
            className={`flex-row mb-4 p-6 rounded-lg  ${
              isDark ? 'bg-dark-surface/40' : 'bg-neutral-100/60'
            }`}
          >
            <View className="items-center">
              <View className={`p-4 rounded-lg shadow-sm border w-40 ${
                isDark ? 'bg-dark-surface border-dark-border' : 'bg-white border-light-border/20'
              }`}>
                <Text className={`font-bold text-sm ${isDark ? 'text-dark-primary' : 'text-light-primary'}`}>
                  {label}
                </Text>
                <Text className={`text-xs mt-1 ${isDark ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                  {sublabel}
                </Text>
              </View>
            </View>
            <View className="ml-4 flex-1 flex-row flex-wrap gap-4 items-center justify-start">
              {children}
            </View>
          </View>
        )}
      </>
    );
  }
);
